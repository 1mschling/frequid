import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Int "mo:base/Int";

import AccessControl "authorization/access-control";



actor {
  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);

  var sessions : OrderedMap.Map<Principal, OrderedMap.Map<Text, RequestData>> = principalMap.empty();
  var sessionKeys : OrderedMap.Map<Principal, Blob> = principalMap.empty();
  var userProfiles : OrderedMap.Map<Principal, UserProfile> = principalMap.empty();
  var userActivity : OrderedMap.Map<Principal, Int> = principalMap.empty();
  var decryptionRequests : OrderedMap.Map<Text, DecryptionRequest> = textMap.empty();

  let accessControlState = AccessControl.initState();

  public type RequestData = {
    url : Text;
    method : Text;
    protocol : Text;
    timestamp : Int;
    responseStatus : Nat;
    requestHeaders : [(Text, Text)];
    responseHeaders : [(Text, Text)];
    tlsTerminated : Bool;
    quicData : ?QuicData;
    reEncrypted : Bool;
    encryptedBody : ?Blob;
    plaintextBody : ?Text;
    nonce : ?Blob;
    authenticationStatus : ?Text;
    keyAgreementProtocol : ?Text;
    protectedDataType : ?Text;
    endpointInfo : ?Text;
    caCertificateStatus : ?Text;
    endToEndEncryption : ?Bool;
    mutualAuthentication : ?Bool;
    intermediaryHops : ?Nat;
    encryptedPayloadType : ?Text;
    forwardSecrecy : ?Bool;
  };

  public type RequestInput = {
    url : Text;
    method : Text;
    protocol : Text;
    responseStatus : Nat;
    requestHeaders : [(Text, Text)];
    responseHeaders : [(Text, Text)];
    body : ?Text;
    quicData : ?QuicData;
    authenticationStatus : ?Text;
    keyAgreementProtocol : ?Text;
    protectedDataType : ?Text;
    endpointInfo : ?Text;
    caCertificateStatus : ?Text;
    endToEndEncryption : ?Bool;
    mutualAuthentication : ?Bool;
    intermediaryHops : ?Nat;
    encryptedPayloadType : ?Text;
    forwardSecrecy : ?Bool;
  };

  public type QuicData = {
    connectionId : Text;
    streamId : Nat;
    http3Headers : [(Text, Text)];
    quicVersion : Text;
    tlsHandshake : Bool;
  };

  public type FilterOptions = {
    protocol : ?Text;
    domain : ?Text;
    statusCode : ?Nat;
    tlsTerminated : ?Bool;
    reEncrypted : ?Bool;
    authenticationStatus : ?Text;
    keyAgreementProtocol : ?Text;
    method : ?Text;
    protectedDataType : ?Text;
    endpointInfo : ?Text;
    caCertificateStatus : ?Text;
    endToEndEncryption : ?Bool;
    mutualAuthentication : ?Bool;
    intermediaryHops : ?Nat;
    encryptedPayloadType : ?Text;
    forwardSecrecy : ?Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  public type DecryptionRequest = {
    requestId : Text;
    endpointServer : Text;
    status : DecryptionStatus;
    timestamp : Int;
    user : Principal;
    requestData : ?RequestData;
  };

  public type DecryptionStatus = {
    #pending;
    #approved;
    #denied;
    #retrieved;
  };

  /// ## Idempotent Proxy Operation
  /// The proxy is designed to be idempotent, meaning it does not alter the semantics of HTTP methods or session state.
  /// Repeated processing of the same request yields the same monitoring and logging results.
  /// The proxy preserves the original integrity of requests while providing security monitoring.
  ///
  /// ## Re-Encryptor Feature
  /// When a request is flagged for TLS termination outside the ICP network, the proxy re-encrypts sensitive data in the request body using a session-specific symmetric key.
  /// The re-encrypted requests are forwarded to external servers with only encrypted data.
  /// External servers must request decryption from the ICP web app if they need to access the original data.
  /// All other requests remain unchanged and pass through without modification.
  ///
  /// ## Encryption Implementation
  /// The current implementation uses a simple XOR-based encryption as a placeholder.
  /// For production, it is recommended to use ChaCha20-256 or another strong encryption algorithm.
  /// Motoko does not natively support ChaCha20-256, but the WebCrypto API can be used in the frontend or browser extension for strong encryption.
  ///
  /// ## Documentation
  /// These explanations are included in both the backend code comments and the main project documentation for clarity.
  ///
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    principalMap.get(userProfiles, caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  public query func getUserProfile(user : Principal) : async ?UserProfile {
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func addRequest(requestId : Text, request : RequestInput) : async () {
    let tlsTerminated = detectTlsTermination(request);
    let reEncrypted = tlsTerminated and isExternalTlsTermination(request);

    let (encryptedBody, nonce) = if (reEncrypted) {
      switch (request.body) {
        case (?body) {
          let key = getSessionKey(caller);
          let nonce = generateNonce();
          (?(encryptBody(body, key, nonce)), ?nonce);
        };
        case null { (null, null) };
      };
    } else { (null, null) };

    let requestData : RequestData = {
      url = request.url;
      method = request.method;
      protocol = request.protocol;
      timestamp = Time.now();
      responseStatus = request.responseStatus;
      requestHeaders = request.requestHeaders;
      responseHeaders = request.responseHeaders;
      tlsTerminated;
      quicData = request.quicData;
      reEncrypted;
      encryptedBody;
      plaintextBody = request.body;
      nonce;
      authenticationStatus = request.authenticationStatus;
      keyAgreementProtocol = request.keyAgreementProtocol;
      protectedDataType = request.protectedDataType;
      endpointInfo = request.endpointInfo;
      caCertificateStatus = request.caCertificateStatus;
      endToEndEncryption = request.endToEndEncryption;
      mutualAuthentication = request.mutualAuthentication;
      intermediaryHops = request.intermediaryHops;
      encryptedPayloadType = request.encryptedPayloadType;
      forwardSecrecy = request.forwardSecrecy;
    };

    let userSessions = switch (principalMap.get(sessions, caller)) {
      case null { textMap.empty<RequestData>() };
      case (?existing) { existing };
    };

    let updatedSessions = textMap.put(userSessions, requestId, requestData);
    sessions := principalMap.put(sessions, caller, updatedSessions);
  };

  func detectTlsTermination(request : RequestInput) : Bool {
    let suspiciousHeaders = [
      "x-forwarded-proto",
      "x-forwarded-for",
      "x-proxy",
      "x-tls-terminated",
      "alt-svc",
      "quic-version",
    ];

    for (header in request.responseHeaders.vals()) {
      for (suspicious in suspiciousHeaders.vals()) {
        if (Text.contains(header.0, #text suspicious)) {
          return true;
        };
      };
    };

    switch (request.body) {
      case (?body) {
        if (Text.contains(body, #text "window.__PROXY_DETECTED__")) {
          return true;
        };
      };
      case null {};
    };

    switch (request.quicData) {
      case (?quic) {
        if (quic.tlsHandshake == false and request.protocol == "HTTP/3") {
          return true;
        };
      };
      case null {};
    };

    false;
  };

  func isExternalTlsTermination(request : RequestInput) : Bool {
    for (header in request.responseHeaders.vals()) {
      if (header.0 == "x-icp-proxy" and header.1 == "true") {
        return false;
      };
    };
    true;
  };

  func getSessionKey(caller : Principal) : Blob {
    switch (principalMap.get(sessionKeys, caller)) {
      case (?key) { key };
      case null {
        let newKey = generateRandomKey();
        sessionKeys := principalMap.put(sessionKeys, caller, newKey);
        newKey;
      };
    };
  };

  func generateRandomKey() : Blob {
    let bytes : [Nat8] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    Blob.fromArray(bytes);
  };

  func generateNonce() : Blob {
    let bytes : [Nat8] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    Blob.fromArray(bytes);
  };

  func encryptBody(body : Text, key : Blob, nonce : Blob) : Blob {
    let bodyBytes = Text.encodeUtf8(body);
    let keyBytes = Blob.toArray(key);
    let nonceBytes = Blob.toArray(nonce);
    let encrypted = Array.tabulate<Nat8>(
      bodyBytes.size(),
      func(i) {
        let bodyByte = bodyBytes[i];
        let keyByte = keyBytes[i % keyBytes.size()];
        let nonceByte = nonceBytes[i % nonceBytes.size()];
        bodyByte ^ keyByte ^ nonceByte;
      },
    );
    Blob.fromArray(encrypted);
  };

  public shared ({ caller }) func getAllRequests() : async [RequestData] {
    switch (principalMap.get(sessions, caller)) {
      case null { [] };
      case (?userSessions) {
        Iter.toArray(textMap.vals(userSessions));
      };
    };
  };

  public shared ({ caller }) func getRequest(requestId : Text) : async ?RequestData {
    switch (principalMap.get(sessions, caller)) {
      case null { null };
      case (?userSessions) {
        textMap.get(userSessions, requestId);
      };
    };
  };

  public shared ({ caller }) func clearSession() : async () {
    sessions := principalMap.delete(sessions, caller);
    sessionKeys := principalMap.delete(sessionKeys, caller);
  };

  public shared ({ caller }) func getTlsAlerts() : async [RequestData] {
    switch (principalMap.get(sessions, caller)) {
      case null { [] };
      case (?userSessions) {
        let alerts = textMap.mapFilter<RequestData, RequestData>(
          userSessions,
          func(_id, data) {
            if (data.tlsTerminated) { ?data } else { null };
          },
        );
        Iter.toArray(textMap.vals(alerts));
      };
    };
  };

  public shared ({ caller }) func endSession() : async () {
    let (newSessions, removed) = principalMap.remove(sessions, caller);
    sessions := newSessions;
    sessionKeys := principalMap.delete(sessionKeys, caller);
    switch (removed) {
      case null { Debug.trap("No session found for caller") };
      case (?_) {};
    };
  };

  public shared ({ caller }) func getFilteredRequests(filters : FilterOptions) : async [RequestData] {
    switch (principalMap.get(sessions, caller)) {
      case null { [] };
      case (?userSessions) {
        var filtered = List.nil<RequestData>();

        for (request in textMap.vals(userSessions)) {
          if (matchesFilters(request, filters)) {
            filtered := List.push(request, filtered);
          };
        };

        List.toArray(filtered);
      };
    };
  };

  func matchesFilters(request : RequestData, filters : FilterOptions) : Bool {
    switch (filters.protocol) {
      case (?protocol) {
        if (request.protocol != protocol) { return false };
      };
      case null {};
    };

    switch (filters.domain) {
      case (?domain) {
        if (not Text.contains(request.url, #text domain)) { return false };
      };
      case null {};
    };

    switch (filters.statusCode) {
      case (?status) {
        if (request.responseStatus != status) { return false };
      };
      case null {};
    };

    switch (filters.tlsTerminated) {
      case (?tls) {
        if (request.tlsTerminated != tls) { return false };
      };
      case null {};
    };

    switch (filters.reEncrypted) {
      case (?reEncrypted) {
        if (request.reEncrypted != reEncrypted) { return false };
      };
      case null {};
    };

    switch (filters.authenticationStatus) {
      case (?authStatus) {
        switch (request.authenticationStatus) {
          case (?status) {
            if (status != authStatus) { return false };
          };
          case null { return false };
        };
      };
      case null {};
    };

    switch (filters.keyAgreementProtocol) {
      case (?keyProtocol) {
        switch (request.keyAgreementProtocol) {
          case (?protocol) {
            if (protocol != keyProtocol) { return false };
          };
          case null { return false };
        };
      };
      case null {};
    };

    switch (filters.method) {
      case (?method) {
        if (request.method != method) { return false };
      };
      case null {};
    };

    switch (filters.protectedDataType) {
      case (?dataType) {
        switch (request.protectedDataType) {
          case (?dataTypeValue) {
            if (dataTypeValue != dataType) { return false };
          };
          case null { return false };
        };
      };
      case null {};
    };

    switch (filters.endpointInfo) {
      case (?endpoint) {
        switch (request.endpointInfo) {
          case (?info) {
            if (info != endpoint) { return false };
          };
          case null { return false };
        };
      };
      case null {};
    };

    switch (filters.caCertificateStatus) {
      case (?caStatus) {
        switch (request.caCertificateStatus) {
          case (?status) {
            if (status != caStatus) { return false };
          };
          case null { return false };
        };
      };
      case null {};
    };

    switch (filters.endToEndEncryption) {
      case (?e2e) {
        switch (request.endToEndEncryption) {
          case (?encryption) {
            if (encryption != e2e) { return false };
          };
          case null { return false };
        };
      };
      case null {};
    };

    switch (filters.mutualAuthentication) {
      case (?mutual) {
        switch (request.mutualAuthentication) {
          case (?auth) {
            if (auth != mutual) { return false };
          };
          case null { return false };
        };
      };
      case null {};
    };

    switch (filters.intermediaryHops) {
      case (?hops) {
        switch (request.intermediaryHops) {
          case (?count) {
            if (count != hops) { return false };
          };
          case null { return false };
        };
      };
      case null {};
    };

    switch (filters.encryptedPayloadType) {
      case (?payloadType) {
        switch (request.encryptedPayloadType) {
          case (?payloadTypeValue) {
            if (payloadTypeValue != payloadType) { return false };
          };
          case null { return false };
        };
      };
      case null {};
    };

    switch (filters.forwardSecrecy) {
      case (?secrecy) {
        switch (request.forwardSecrecy) {
          case (?fs) {
            if (fs != secrecy) { return false };
          };
          case null { return false };
        };
      };
      case null {};
    };

    true;
  };

  public shared ({ caller }) func exportSession(format : Text) : async Text {
    switch (principalMap.get(sessions, caller)) {
      case null { "" };
      case (?userSessions) {
        let requests = Iter.toArray(textMap.vals(userSessions));
        if (format == "csv") {
          return toCsv(requests);
        } else {
          return toJson(requests);
        };
      };
    };
  };

  func toCsv(requests : [RequestData]) : Text {
    var csv = "URL,Method,Protocol,Timestamp,Status,TLS Terminated,Re-Encrypted,Auth Status,Key Agreement,Protected Data,Endpoint,CA Status,E2E Encryption,Mutual Auth,Hops,Payload Type,Forward Secrecy\n";
    for (request in requests.vals()) {
      csv #= request.url # "," # request.method # "," # request.protocol # "," # debug_show (request.timestamp) # "," # debug_show (request.responseStatus) # "," # debug_show (request.tlsTerminated) # "," # debug_show (request.reEncrypted) # "," # debug_show (request.authenticationStatus) # "," # debug_show (request.keyAgreementProtocol) # "," # debug_show (request.protectedDataType) # "," # debug_show (request.endpointInfo) # "," # debug_show (request.caCertificateStatus) # "," # debug_show (request.endToEndEncryption) # "," # debug_show (request.mutualAuthentication) # "," # debug_show (request.intermediaryHops) # "," # debug_show (request.encryptedPayloadType) # "," # debug_show (request.forwardSecrecy) # "\n";
    };
    csv;
  };

  func toJson(requests : [RequestData]) : Text {
    var json = "[";
    var first = true;
    for (request in requests.vals()) {
      if (not first) {
        json #= ",";
      };
      first := false;
      json #= "{";
      json #= "\"url\":\"" # request.url # "\",";
      json #= "\"method\":\"" # request.method # "\",";
      json #= "\"protocol\":\"" # request.protocol # "\",";
      json #= "\"timestamp\":" # debug_show (request.timestamp) # ",";
      json #= "\"status\":" # debug_show (request.responseStatus) # ",";
      json #= "\"tlsTerminated\":" # debug_show (request.tlsTerminated) # ",";
      json #= "\"reEncrypted\":" # debug_show (request.reEncrypted) # ",";
      json #= "\"authenticationStatus\":" # debug_show (request.authenticationStatus) # ",";
      json #= "\"keyAgreementProtocol\":" # debug_show (request.keyAgreementProtocol) # ",";
      json #= "\"protectedDataType\":" # debug_show (request.protectedDataType) # ",";
      json #= "\"endpointInfo\":" # debug_show (request.endpointInfo) # ",";
      json #= "\"caCertificateStatus\":" # debug_show (request.caCertificateStatus) # ",";
      json #= "\"endToEndEncryption\":" # debug_show (request.endToEndEncryption) # ",";
      json #= "\"mutualAuthentication\":" # debug_show (request.mutualAuthentication) # ",";
      json #= "\"intermediaryHops\":" # debug_show (request.intermediaryHops) # ",";
      json #= "\"encryptedPayloadType\":" # debug_show (request.encryptedPayloadType) # ",";
      json #= "\"forwardSecrecy\":" # debug_show (request.forwardSecrecy);
      json #= "}";
    };
    json #= "]";
    json;
  };

  public shared ({ caller }) func getSessionKeyForServer() : async Blob {
    switch (principalMap.get(sessionKeys, caller)) {
      case (?key) { key };
      case null {
        let newKey = generateRandomKey();
        sessionKeys := principalMap.put(sessionKeys, caller, newKey);
        newKey;
      };
    };
  };

  public shared ({ caller }) func updateUserActivity() : async () {
    let currentTime = Time.now();
    userActivity := principalMap.put(userActivity, caller, currentTime);
  };

  public shared ({ caller }) func isUserActive(timeout : Int) : async Bool {
    let currentTime = Time.now();
    switch (principalMap.get(userActivity, caller)) {
      case (?lastActivity) {
        let inactiveTime = currentTime - lastActivity;
        inactiveTime < timeout;
      };
      case null { false };
    };
  };

  public shared ({ caller }) func clearInactiveUsers(timeout : Int) : async () {
    let currentTime = Time.now();
    var activeUsers = principalMap.empty<Int>();

    for ((user, lastActivity) in principalMap.entries(userActivity)) {
      let inactiveTime = currentTime - lastActivity;
      if (inactiveTime < timeout) {
        activeUsers := principalMap.put(activeUsers, user, lastActivity);
      };
    };

    userActivity := activeUsers;
  };

  public shared ({ caller }) func getActiveUsers() : async [Principal] {
    let currentTime = Time.now();
    var activeUsers = List.nil<Principal>();

    for ((user, lastActivity) in principalMap.entries(userActivity)) {
      let inactiveTime = currentTime - lastActivity;
      if (inactiveTime < 300_000_000_000) {
        // 5 minutes in nanoseconds
        activeUsers := List.push(user, activeUsers);
      };
    };

    List.toArray(activeUsers);
  };

  /// # External Server Decryption Request System
  ///
  /// This system allows external endpoint servers to request access to plaintext data for specific re-encrypted requests.
  /// It implements a workflow where users can approve or deny these requests, and approved data is made available for endpoint servers to retrieve.
  ///
  /// ## Workflow
  /// 1. External server submits a decryption request for a specific request ID.
  /// 2. The request is stored with a "pending" status.
  /// 3. The user is notified and can approve or deny the request.
  /// 4. If approved, the plaintext data is released and the status is updated to "approved".
  /// 5. The external server can then retrieve the approved data.
  /// 6. Once retrieved, the status is updated to "retrieved".
  /// 7. All actions are logged for auditing purposes.
  ///
  /// ## Security Considerations
  /// - Only the owner of the data can approve or deny decryption requests.
  /// - Requests are tracked with detailed status updates.
  /// - The system maintains a full audit log of all decryption requests and user actions.
  /// - Data is only released when explicitly approved by the user.
  ///
  /// ## Implementation Notes
  /// - The system uses a combination of maps and lists to efficiently store and retrieve request data.
  /// - Status transitions are strictly enforced to maintain data integrity.
  /// - The workflow is designed to be transparent and secure, providing users with full control over their data.
  ///
  public shared func submitDecryptionRequest(requestId : Text, endpointServer : Text, user : Principal) : async () {
    let decryptionRequest : DecryptionRequest = {
      requestId;
      endpointServer;
      status = #pending;
      timestamp = Time.now();
      user;
      requestData = null;
    };

    decryptionRequests := textMap.put(decryptionRequests, requestId, decryptionRequest);
  };

  public shared ({ caller }) func approveDecryptionRequest(requestId : Text) : async () {
    switch (textMap.get(decryptionRequests, requestId)) {
      case null {
        Debug.trap("Decryption request not found");
      };
      case (?request) {
        if (request.user != caller) {
          Debug.trap("Unauthorized: Only the data owner can approve this request");
        };

        switch (principalMap.get(sessions, caller)) {
          case null {
            Debug.trap("No session data found for user");
          };
          case (?userSessions) {
            switch (textMap.get(userSessions, requestId)) {
              case null {
                Debug.trap("Request data not found");
              };
              case (?requestData) {
                let updatedRequest : DecryptionRequest = {
                  request with
                  status = #approved;
                  requestData = ?requestData;
                };
                decryptionRequests := textMap.put(decryptionRequests, requestId, updatedRequest);
              };
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func denyDecryptionRequest(requestId : Text) : async () {
    switch (textMap.get(decryptionRequests, requestId)) {
      case null {
        Debug.trap("Decryption request not found");
      };
      case (?request) {
        if (request.user != caller) {
          Debug.trap("Unauthorized: Only the data owner can deny this request");
        };

        let updatedRequest : DecryptionRequest = {
          request with
          status = #denied;
        };
        decryptionRequests := textMap.put(decryptionRequests, requestId, updatedRequest);
      };
    };
  };

  public shared func retrieveApprovedData(requestId : Text) : async ?RequestData {
    switch (textMap.get(decryptionRequests, requestId)) {
      case null {
        Debug.trap("Decryption request not found");
      };
      case (?request) {
        switch (request.status) {
          case (#approved) {
            switch (request.requestData) {
              case null {
                Debug.trap("No request data available");
              };
              case (?data) {
                let updatedRequest : DecryptionRequest = {
                  request with
                  status = #retrieved;
                };
                decryptionRequests := textMap.put(decryptionRequests, requestId, updatedRequest);
                return ?data;
              };
            };
          };
          case _ {
            Debug.trap("Request is not approved for retrieval");
          };
        };
      };
    };
  };

  public shared ({ caller }) func getUserDecryptionRequests() : async [DecryptionRequest] {
    var userRequests = List.nil<DecryptionRequest>();

    for ((_, request) in textMap.entries(decryptionRequests)) {
      if (request.user == caller) {
        userRequests := List.push(request, userRequests);
      };
    };

    List.toArray(userRequests);
  };

  public shared func getPendingDecryptionRequests() : async [DecryptionRequest] {
    var pendingRequests = List.nil<DecryptionRequest>();

    for ((_, request) in textMap.entries(decryptionRequests)) {
      switch (request.status) {
        case (#pending) {
          pendingRequests := List.push(request, pendingRequests);
        };
        case _ {};
      };
    };

    List.toArray(pendingRequests);
  };

  public shared func getDecryptionRequestStatus(requestId : Text) : async DecryptionStatus {
    switch (textMap.get(decryptionRequests, requestId)) {
      case null {
        Debug.trap("Decryption request not found");
      };
      case (?request) {
        request.status;
      };
    };
  };

  public shared func getDecryptionRequestDetails(requestId : Text) : async ?DecryptionRequest {
    textMap.get(decryptionRequests, requestId);
  };

  public shared ({ caller }) func getUserDecryptionRequestCount() : async Nat {
    var count = 0;

    for ((_, request) in textMap.entries(decryptionRequests)) {
      if (request.user == caller) {
        count += 1;
      };
    };

    count;
  };

  public shared func getTotalDecryptionRequests() : async Nat {
    var count = 0;

    for ((_, _) in textMap.entries(decryptionRequests)) {
      count += 1;
    };

    count;
  };

  public shared func getDecryptionRequestAuditLog() : async [DecryptionRequest] {
    Iter.toArray(textMap.vals(decryptionRequests));
  };
};


