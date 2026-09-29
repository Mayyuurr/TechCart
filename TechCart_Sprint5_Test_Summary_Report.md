# Test Summary Report: TechCart Checkout and Registration
**Document Ref:** TSR-TC-093
**Sprint:** Sprint 5
**Date of Execution:** July 21, 2026
**Author** Lead QAEngieer
**Staging Target** http://localhost:5000

## 1. Executive Summary
During Sprint 5, the Qualit Assurance team conducted comprehensive functional, database and responsive UI evaluation of TechCart registration and Checkout module. The Testing was executed on localhost:5000 using our optimized database.

A total of 6 Test cases were planned and ececuted, achieving 100% execution coverage. However, critical logic erros in our checkout math and unhandled exception during duplicate signup resulted in a high failure rate, with only 50% of test cases passing successfully.

## 2. Test Execution Metrics
| Metric | Planned | Executed | Passed | Failed | Target Coverage | Actual Coverage | Pass Rate |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Sprint 5 Total** | 6 | 6 | 3 | 3 | 100% | 100% | **50%** |

## 3. Open Defect Ledger
The Following defects remain unresolved at the end close of sprint 5 testing

1. **TCART-102 (Severity: Critical | Priority: High)** [cite: 41]
   - *Summary:* Express backend throws unhandled 500 error on duplicate signup, freezing the UI [cite: 375, 376].
2. **TCART-103 (Severity: Major | Priority: High)** [cite: 41]
   - *Summary:* 'TECH20' promo code applies double flat shipping fee, overcharging the user [cite: 21].
3. **TCART-104 (Severity: Minor | Priority: Medium)** [cite: 41]
   - *Summary:* 'Add to Cart' button overlaps description text at 375px responsive mobile width [cite: 394, 411].

## 4. Go / No-Go Release Recommendation
**Status:** 🔴 **NO-GO (DO NOT RELEASE)**

Based on our empirical testing data, the QA team issues a strict **No-Go** recommendation for the current Sprint 5 build. 

While our Test Execution Coverage reached 100%, our exit criteria failed completely. The presence of one **Critical Severity** defect (TCART-102) and one **Major Severity** calculation defect (TCART-103) introduces unacceptable risks to system stability and customer financial transactions. 

The current build is not fit for purpose and must be held until hotfixes are integrated and successfully retested in our staging environment.
