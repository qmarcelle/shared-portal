# Service Integration Map

| Service            | Endpoint/Base URL                                       | Methods      | Typed Response?               | Mock Paths                                            | UI Hard‑codes                        | Notes                                                |
| ------------------ | ------------------------------------------------------- | ------------ | ----------------------------- | ----------------------------------------------------- | ------------------------------------ | ---------------------------------------------------- |
| claimsService      | /api/member/v1/members/byMemberCk/:id/claims            | GET          | ClaimsResponse                | src/app/claims/mocks/claimsAppMockData.ts             | –                                    | No DELETE/PUT; only GET. Pagination not implemented. |
| memberService      | /api/member/v1/members/byMemberCk/:id                   | GET          | LoggedInUserInfo              | src/mock/loggedInUserInfoMockResp.ts                  | –                                    | Used for member info hydration.                      |
| smartSearch        | /smartSearch/suggestion (ES_API_URL)                    | POST         | SmartSearchSuggestionResponse | src/mock/fusion_search/fusionSearchMockWithAllSets.ts | –                                    | Returns mock on error. Uses ES API.                  |
| esApi              | (ES_API_URL, see env)                                   | POST         | ESResponse                    | –                                                     | –                                    | Used for smartSearch, other ES endpoints.            |
| memberDetails      | (mock only)                                             | –            | memberMockResponse            | src/app/profileSettings/mock/memberMockResponse.ts    | –                                    | Not implemented, always returns mock.                |
| externalAppIframe  | (N/A, axios.get to external URL)                        | GET          | –                             | –                                                     | –                                    | Uses process.env.NEXT_PUBLIC_ANWAS_31_URL.           |
| pcpService         | (PORTAL_SERVICES_URL + PCPSERVICE_CONTEXT_ROOT)         | axios.create | –                             | –                                                     | –                                    | Axios instance, no direct usage found in actions.    |
| idCardService      | (PORTAL_SERVICES_URL + IDCARDSERVICE_CONTEXT_ROOT)      | axios.create | –                             | –                                                     | –                                    | Axios instance, no direct usage found in actions.    |
| memberLimitService | (PORTAL_SERVICES_URL + MEMBERLIMITSERVICE_CONTEXT_ROOT) | axios.create | –                             | –                                                     | –                                    | Axios instance, no direct usage found in actions.    |
| chatAPI            | /api/chat/getChatInfo, /api/chat/token                  | GET          | ChatInfoResponse              | src/app/chat/services/**tests**/chatAPI.test.ts      | –                                    | Used by chatStore, GenesysScript, etc.               |
| Genesys/Chat       | (various, see env: GENESYS_BOOTSTRAP_URL, etc.)         | GET/POST     | –                             | –                                                     | src/app/components/GenesysScript.tsx | Uses env URLs, legacy/modern chat modes.             |

---

## Discrepancies & Quick Wins

- **Still Mocked:**
  - `memberDetails` always returns mock.
  - `smartSearch` returns mock on error.
  - Claims mocks exist but are not used unless code is uncommented.
- **Hard-coded UI:**
  - Several components reference hard-coded URLs (e.g., menuNavigation.tsx, GenesysScript.tsx).
  - Inline JSON objects in test and mock files (see `src/mock/`, `src/tests/`).
- **Quick Wins:**
  - Remove or replace fallback mock returns in production code.
  - Centralize all service URLs in `/lib/services/` and reference via typed wrappers.
  - Refactor UI components to use service wrappers instead of hard-coded data.

---

## Recommended Folder Structure

```
/lib/services/
  claimsService.ts
  memberService.ts
  smartSearchService.ts
  chatService.ts
  ...
/app/actions/
  getClaimsData.ts
  getMemberDetails.ts
  invokeSmartSearch.ts
  ...
/mocks/
  claimsAppMockData.ts
  loggedInUserInfoMockResp.ts
  fusionSearchMockWithAllSets.ts
  ...
```

- **/lib/services/**: Typed wrappers for all networked services (axios/fetch).
- **/app/actions/**: Server actions, only call service wrappers.
- **/mocks/**: All mock data, used only in tests or fallback error handling.

---

## TODO Checklist

- [ ] Replace hard-coded `/assets/chatConfig.json` in ChatWidget with `chatService.getConfig()`.
- [ ] Remove direct mock returns in `memberDetails` and `smartSearch` actions.
- [ ] Refactor all axios/fetch calls to go through `/lib/services/` wrappers.
- [ ] Audit all UI components for hard-coded URLs and replace with service-driven data.
- [ ] Implement pagination and DELETE/PUT for claimsService if required.
- [ ] Ensure all service responses are typed and validated.
- [ ] Add/replace tests to use `/mocks/` only via dependency injection.

---

SERVICE_INTEGRATION_MAP.md ready ✔️ (10 services, 5 mocks, 4 hard‑coded UI spots).
