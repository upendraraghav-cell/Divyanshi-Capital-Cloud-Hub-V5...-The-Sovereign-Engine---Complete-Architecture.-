# Divyanshi Capital - Agent Instructions

## CORE MISSION
Ensure seamless synchronization between the **SaaS Workflow Engine** and the **P1 Master Project Registries**. 

## DATA INTEGRITY (SAAS -> P1)
- **Neural Bridge**: All form submissions MUST pass through the `healPayload` matrix in `server.ts` to prevent data mismatches.
- **Master File IDs**: 
    - **P1 Master (Core Logic)**: `1Mk9AzGdKK07WZCKV6lZgtlM4JWy2sdESQwh70r0UicU`
    - **Sales Log (MIS)**: `1SaFxHICu3GN6Udhxb4hW81RagBpAP-91En-tlNYiKl4`
    - **HR Matrix**: `1xR-UyH8LXvAEacGXL8ZQA7nS7hJds2zlMtzxr6iiuGs`
- **Tab Mapping**:
    - `SALES_ENTRY` -> `SALES_LOG`
    - `HR_ENTRY` -> `HR_MD_APPROVAL`
    - Defaults to `RAW_INBOX`

## SELF-HEALING FEATURES
- **Mismatched Fields**: Automatically map `name` -> `client_name`, `phone` -> `mobile`, and `preferred_bank` -> `bank`.
- **Formatting**: Force numeric cleanup on `amount` and handle 10-digit mobile phone normalization automatically.
- **Fail-Safe**: If a `targetFileId` is ambiguous, default to the **P1 Master** to ensure no data is lost.

## PERFORMANCE (MAKE IT LIGHT)
- **Animations**: Use `motion/react` sparingly for high-impact feedback (e.g., successful sync).
- **Validation**: Perform pre-flight checks on the client-side before triggering the `Neural Bridge`.
- **State Management**: Keep form state flat and optimized to prevent lag on mobile devices.
