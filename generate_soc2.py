import json

controls = [
    # -------------------------------------------------------------------------
    # CC1 — Control Environment
    # -------------------------------------------------------------------------
    {
        "id": "CC1.1",
        "domain": "Control Environment",
        "domainCode": "CC1",
        "title": "COSO Principle 1: Demonstrates Commitment to Integrity and Ethical Values",
        "description": "The entity demonstrates a commitment to integrity and ethical values. This includes establishing standards of conduct, evaluating adherence to those standards, and addressing deviations in a timely manner.",
        "guidance": "Management must set the tone at the top by communicating and modeling ethical behavior throughout the organization. Policies such as a Code of Conduct should be formally documented, acknowledged by employees, and enforced consistently.",
        "implementationGuide": "Deploy a compliance automation platform such as Vanta or Drata to track annual Code of Conduct acknowledgements across all employees and contractors. Upload the signed acknowledgement records as evidence within the platform and configure automated reminders for overdue responses. Use ServiceNow GRC or a similar ticketing system to log and resolve ethics violations or policy deviations within defined SLAs. The 'done' state is achieved when 100% of personnel have a recorded, dated acknowledgement for the current policy version and zero open ethics violations remain unaddressed past the SLA. A common failure mode is maintaining the Code of Conduct as a static PDF with no version control or tracked acknowledgement, leaving auditors with no evidence that employees have read the current version.",
        "exampleEvidence": [
            "Signed Code of Conduct acknowledgement log showing 100% completion rate for all employees and contractors",
            "Code of Conduct policy document with version history and approval signatures from executive leadership",
            "Ethics hotline or reporting channel configuration and anonymity policy",
            "Training completion records for ethics and integrity training delivered via LMS (e.g., KnowBe4)",
            "Board or audit committee meeting minutes referencing review of the Code of Conduct",
            "Disciplinary action log (redacted) demonstrating enforcement of ethics violations"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC1.2",
        "domain": "Control Environment",
        "domainCode": "CC1",
        "title": "COSO Principle 2: Board Exercises Oversight Responsibility",
        "description": "The board of directors demonstrates independence from management and exercises oversight of the development and performance of internal controls. The board establishes oversight responsibilities and evaluates competence and independence of members.",
        "guidance": "The board should include independent directors with relevant expertise and hold regular meetings to review control effectiveness and risk posture. Meeting minutes should document substantive discussion of internal controls, financial reporting, and significant risks.",
        "implementationGuide": "Use OneTrust GRC or AuditBoard to maintain a board oversight calendar and store board meeting minutes with proper access controls. Ensure the board charter, committee charters (audit, risk), and independence disclosures are stored in a document management system with version control. Configure Drata or Vanta to pull board-related evidence artifacts into the compliance workspace for auditor review. The 'done' state is a documented board meeting cadence (at least quarterly) with minutes referencing internal control topics, plus current committee charters signed by independent directors. A common failure mode is producing minutes that are too vague—simply noting 'controls discussed' without capturing the substance of board deliberations, which auditors will flag.",
        "exampleEvidence": [
            "Board of directors charter and committee charters (audit, risk) with current signatures",
            "Board meeting minutes for the past 12 months referencing internal control and risk discussions",
            "Director independence disclosures and conflict-of-interest declarations",
            "Board composition matrix showing relevant expertise of each director",
            "Annual board evaluation or self-assessment results",
            "Audit committee schedule of activities and evidence of completed reviews"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC1.3",
        "domain": "Control Environment",
        "domainCode": "CC1",
        "title": "COSO Principle 3: Establishes Structure, Authority, and Responsibility",
        "description": "Management establishes structures, reporting lines, and appropriate authorities and responsibilities in the pursuit of objectives. This includes defining roles, segregating duties, and ensuring accountability.",
        "guidance": "Organizational charts, role definitions, and RACI matrices should be current, approved, and accessible to all staff. Segregation of duties must be enforced in critical processes such as financial approvals, system access provisioning, and change management.",
        "implementationGuide": "Maintain role definitions and org charts in an HRIS such as Workday or BambooHR, and integrate that data with your identity governance tool (e.g., SailPoint or Okta) to enforce role-based access controls aligned to documented responsibilities. Use Vanta or Secureframe to automatically surface access reviews and flag users whose system privileges exceed their documented role. The 'done' state is an org chart updated within the last quarter, role descriptions for every position, and a quarterly access review showing no unresolved SoD conflicts. A common failure mode is allowing system access to drift from documented roles over time—employees accumulate permissions from prior roles, and no periodic review catches the violations.",
        "exampleEvidence": [
            "Current organizational chart with reporting lines approved by executive leadership",
            "Job descriptions for all key roles with defined responsibilities and authorities",
            "RACI matrix for critical business processes (e.g., change management, access provisioning)",
            "Segregation of duties (SoD) conflict matrix and current SoD violation report",
            "Access review results showing alignment of system privileges to job roles",
            "Delegation of authority policy with approval thresholds and signatory lists"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC1.4",
        "domain": "Control Environment",
        "domainCode": "CC1",
        "title": "COSO Principle 4: Demonstrates Commitment to Competence",
        "description": "The entity demonstrates a commitment to attract, develop, and retain competent individuals in alignment with objectives. This includes establishing competency requirements, providing training, and evaluating performance.",
        "guidance": "HR processes should include defined competency frameworks for each role, structured onboarding with security and compliance training, and annual performance evaluations tied to those competencies. Security awareness training must be tracked and completion rates reported.",
        "implementationGuide": "Use a learning management system such as KnowBe4 or Proofpoint Security Awareness Training to deliver and track mandatory security awareness training for all employees, with completion reports exportable for auditor review. Integrate training completion status into Vanta or Drata so the compliance platform automatically flags employees who are overdue. Tie competency assessments to annual performance reviews managed in Lattice or Workday. The 'done' state is 100% of employees completing required training within the defined window (typically 30 days of hire and annually thereafter) with no overdue records. A common failure mode is excluding contractors and temporary staff from training requirements, creating coverage gaps that auditors will identify.",
        "exampleEvidence": [
            "Security awareness training completion report showing 100% of in-scope employees and contractors",
            "Onboarding checklist with security training items and sign-off dates",
            "Annual performance review records referencing competency assessments",
            "Job posting templates showing minimum qualifications aligned to role competency frameworks",
            "Background check policy and evidence of pre-employment screening",
            "Training curriculum outline and course materials for security and compliance training"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC1.5",
        "domain": "Control Environment",
        "domainCode": "CC1",
        "title": "COSO Principle 5: Enforces Accountability",
        "description": "The entity holds individuals accountable for their internal control responsibilities in the pursuit of objectives. This includes establishing performance measures, incentives, and disciplinary mechanisms.",
        "guidance": "Performance metrics for control owners should be documented and monitored, with consequences for non-compliance clearly defined in HR policies. Control deficiencies should be tracked and remediated with assigned owners and deadlines.",
        "implementationGuide": "Configure ServiceNow GRC or Tugboat Logic to assign control ownership to named individuals and track remediation of control deficiencies with due dates and escalation paths. Use Vanta or AuditBoard to generate control health dashboards visible to senior management, ensuring accountability is visible. Define KPIs for control performance (e.g., time-to-remediate findings, training completion rates) and review them in monthly management meetings. The 'done' state is every control having a named owner, all open deficiencies having a remediation plan with a due date, and management sign-off on the dashboard at least monthly. A common failure mode is assigning ownership without any follow-up mechanism—deficiencies are logged but never escalated, so they age indefinitely.",
        "exampleEvidence": [
            "Control ownership register mapping each control to a named owner and their manager",
            "Open deficiency and remediation tracking report with due dates and status",
            "Management review meeting minutes referencing control performance metrics",
            "HR policy section on disciplinary actions for control failures or policy violations",
            "Performance review documentation tying control KPIs to individual evaluations",
            "Escalation procedure for overdue remediation items with evidence of activation"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    # -------------------------------------------------------------------------
    # CC2 — Communication and Information
    # -------------------------------------------------------------------------
    {
        "id": "CC2.1",
        "domain": "Communication and Information",
        "domainCode": "CC2",
        "title": "COSO Principle 13: Uses Relevant, Quality Information",
        "description": "The entity obtains or generates and uses relevant, quality information to support the functioning of internal controls. Information should be accurate, timely, and accessible to those who need it.",
        "guidance": "Data quality controls should be in place to validate that inputs feeding control monitoring systems are complete and accurate. Information security policies should define classification, handling, and retention requirements for control-relevant data.",
        "implementationGuide": "Implement a data quality framework using AWS Config or Azure Policy to continuously validate configuration data against defined baselines, ensuring the information feeding control dashboards is accurate and current. Integrate these signals into a SIEM such as Splunk or Microsoft Sentinel to provide a reliable, near-real-time information feed for security controls. Use Vanta or Drata to aggregate control evidence and flag stale or missing data. The 'done' state is automated data quality checks running on at least daily cadence with no unresolved data quality alerts older than 48 hours. A common failure mode is relying on manual spreadsheets for control monitoring—data goes stale, has errors, and lacks an audit trail, undermining the reliability of the information.",
        "exampleEvidence": [
            "Data classification policy and information handling standards",
            "AWS Config or Azure Policy rule list with compliance percentage report",
            "SIEM dashboard screenshot showing real-time data feeds and alert counts",
            "Data quality check results or automated validation report",
            "Information retention and disposal schedule with evidence of enforcement",
            "Control monitoring dashboard with data freshness indicators"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC2.2",
        "domain": "Communication and Information",
        "domainCode": "CC2",
        "title": "COSO Principle 14: Communicates Internally",
        "description": "The entity internally communicates information, including objectives and responsibilities for internal control, necessary to support the functioning of internal controls. Communication should flow up, down, and across the organization.",
        "guidance": "Control-related communications should be documented and traceable, including policy updates, security alerts, and control ownership changes. Channels for raising control concerns internally—such as an ethics hotline or management escalation path—must be clearly communicated.",
        "implementationGuide": "Use Confluence or SharePoint as the authoritative intranet for publishing policies, control documentation, and security communications, with version tracking and read-confirmation workflows. Integrate policy acknowledgement tracking with Vanta or Secureframe so that when a policy is updated, all in-scope personnel are automatically prompted to re-acknowledge and completion is tracked. Configure Slack or Microsoft Teams channels for security-relevant announcements with pinned policy links. The 'done' state is every in-scope policy having a published date, a list of acknowledged recipients, and a mechanism for employees to ask questions or raise concerns. A common failure mode is publishing policies to the intranet without any acknowledgement tracking, making it impossible to demonstrate that employees were informed.",
        "exampleEvidence": [
            "Policy publication log showing date of distribution and acknowledgement rates",
            "Intranet or SharePoint screenshot of security policy library with version history",
            "All-hands or security communication emails or Slack announcements with distribution records",
            "Ethics hotline or internal reporting channel configuration and communication to employees",
            "Onboarding checklist confirming new hires receive security and policy orientation",
            "Meeting minutes or town hall records referencing internal control topics"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC2.3",
        "domain": "Communication and Information",
        "domainCode": "CC2",
        "title": "COSO Principle 15: Communicates Externally",
        "description": "The entity communicates with external parties regarding matters affecting the functioning of internal controls. This includes customers, regulators, auditors, and vendors.",
        "guidance": "External communications about security and privacy commitments—such as a public-facing privacy notice, security whitepapers, and vendor contracts—must be current, accurate, and aligned with actual practices. A process for receiving and acting on external security reports (e.g., responsible disclosure policy) should be in place.",
        "implementationGuide": "Maintain an up-to-date Trust Center (e.g., built on SafeBase or Vanta Trust Reports) where customers can access security documentation, sub-processor lists, and compliance certifications. Use OneTrust to manage vendor data processing agreements and ensure sub-processor notifications are sent when third parties change. Publish a responsible disclosure or bug bounty policy on the company website and track incoming reports in a ticketing system such as Jira or ServiceNow. The 'done' state is a publicly accessible Trust Center with a current SOC 2 report summary, a documented responsible disclosure process, and a sub-processor list updated within the last 90 days. A common failure mode is allowing the Trust Center or privacy notice to fall out of sync with actual data practices, creating regulatory exposure.",
        "exampleEvidence": [
            "Public Trust Center or security page URL with screenshot and last-updated date",
            "Privacy notice with effective date and revision history",
            "Responsible disclosure or bug bounty policy published on the company website",
            "Customer-facing DPA or MSA template referencing security obligations",
            "Sub-processor list with last review date and change notification procedure",
            "Regulator or auditor communication log from the past 12 months"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    # -------------------------------------------------------------------------
    # CC3 — Risk Assessment
    # -------------------------------------------------------------------------
    {
        "id": "CC3.1",
        "domain": "Risk Assessment",
        "domainCode": "CC3",
        "title": "COSO Principle 6: Specifies Suitable Objectives",
        "description": "The entity specifies objectives with sufficient clarity to enable the identification and assessment of risks relating to objectives. Objectives should be measurable and aligned with business strategy.",
        "guidance": "Security and privacy objectives should be defined at the entity level and linked to operational, reporting, and compliance sub-objectives. These objectives provide the baseline against which risks are assessed and controls are designed.",
        "implementationGuide": "Document entity-level security objectives in a formal risk management policy reviewed and approved by the CISO and executive team annually. Use OneTrust GRC or ServiceNow GRC to create an objective registry that links each objective to associated risks and controls, enabling traceability. Reference these objectives in the annual risk assessment process managed through Tugboat Logic or similar platforms. The 'done' state is a documented, board-approved set of security and operational objectives with measurable success criteria and at least one associated risk for each objective. A common failure mode is defining objectives in broad, unmeasurable terms ('maintain strong security') that cannot be assessed or tied to specific controls.",
        "exampleEvidence": [
            "Approved security objectives register with measurable success criteria and review date",
            "Risk management policy referencing the objective-setting process",
            "Board or executive sign-off on annual security objectives",
            "Traceability matrix linking objectives to associated risks and controls",
            "OKR or KPI dashboard showing progress against security objectives",
            "Annual review record of objectives with updates based on strategic changes"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC3.2",
        "domain": "Risk Assessment",
        "domainCode": "CC3",
        "title": "COSO Principle 7: Identifies and Analyzes Risk",
        "description": "The entity identifies risks to the achievement of its objectives across the entity and analyzes risks as a basis for determining how the risks should be managed. This includes identifying internal and external sources of risk.",
        "guidance": "A formal risk assessment should be performed at least annually and whenever significant changes occur, using a defined methodology that considers likelihood and impact. Risk owners should be assigned and risks documented in a risk register with treatment decisions.",
        "implementationGuide": "Conduct annual risk assessments using a structured methodology within OneTrust GRC, Tugboat Logic, or AuditBoard, documenting inherent risk, control effectiveness, and residual risk for each identified risk. Integrate threat intelligence feeds (e.g., from Recorded Future or MITRE ATT&CK) to ensure external threat sources are considered during risk identification. Export risk register snapshots as audit evidence and ensure risk owners formally accept residual risks above the defined risk tolerance threshold. The 'done' state is a risk register updated within the past 12 months, each risk with an assigned owner, likelihood/impact scores, and a documented treatment decision. A common failure mode is performing a point-in-time risk assessment with no mechanism to trigger reassessment when the environment changes significantly.",
        "exampleEvidence": [
            "Annual risk assessment report with methodology, scope, and findings",
            "Risk register with likelihood/impact ratings, risk owners, and treatment decisions",
            "Threat intelligence sources or feeds referenced in the risk assessment",
            "Risk acceptance sign-off from named risk owners for residual risks above tolerance",
            "Evidence of risk assessment trigger for significant environmental changes",
            "Board or risk committee presentation of risk assessment results"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC3.3",
        "domain": "Risk Assessment",
        "domainCode": "CC3",
        "title": "COSO Principle 8: Assesses Fraud Risk",
        "description": "The entity considers the potential for fraud in assessing risks to the achievement of objectives. This includes fraudulent financial reporting, misappropriation of assets, and corruption.",
        "guidance": "Fraud risk assessment should be a distinct component of the broader risk assessment, specifically considering incentives, opportunities, and rationalizations for fraud. Controls should be designed to prevent and detect fraud, including SoD and monitoring of anomalous activity.",
        "implementationGuide": "Incorporate a fraud risk assessment module within your GRC platform (e.g., AuditBoard or OneTrust GRC), using a fraud risk taxonomy that covers asset misappropriation, financial statement fraud, and system abuse. Implement user behavior analytics tools such as Microsoft Sentinel UEBA or Splunk UBA to detect anomalous access patterns that may indicate insider fraud. Review SoD controls in Workday or SAP using automated conflict detection. The 'done' state is a completed fraud risk assessment with specific fraud scenarios identified, likelihood and impact rated, and mitigating controls mapped to each scenario. A common failure mode is treating fraud risk as a subset of generic risk with no fraud-specific scenarios, making the assessment superficial and unlikely to satisfy auditors.",
        "exampleEvidence": [
            "Fraud risk assessment results with specific fraud scenarios and ratings",
            "SoD conflict detection report from ERP or identity governance platform",
            "User behavior analytics (UEBA) configuration and alert log",
            "Anti-fraud policy and whistleblower protection policy",
            "Management review of fraud risk scenarios with documented conclusions",
            "Controls mapped to each identified fraud risk scenario"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC3.4",
        "domain": "Risk Assessment",
        "domainCode": "CC3",
        "title": "COSO Principle 9: Identifies and Analyzes Significant Change",
        "description": "The entity identifies and assesses changes that could significantly impact the system of internal controls. Changes include those in the external environment, business model, and leadership.",
        "guidance": "A change management process should include a checkpoint to assess whether proposed changes introduce new risks or affect existing controls. Significant changes (e.g., new cloud regions, acquisitions, product launches) should trigger a formal risk assessment update.",
        "implementationGuide": "Embed a risk impact checkpoint into the change management workflow in Jira or ServiceNow, requiring security and compliance review for changes tagged as 'significant.' Use AWS Config or Azure Policy change tracking to detect infrastructure changes that may affect control coverage and automatically alert the security team. Maintain a change log in Vanta or Drata that links infrastructure changes to control re-assessments. The 'done' state is every significant change processed through the risk assessment checkpoint, with documented sign-off from the risk owner before the change is deployed. A common failure mode is allowing engineering changes to bypass the risk checkpoint because the threshold for 'significant' is not clearly defined or enforced.",
        "exampleEvidence": [
            "Change management policy defining 'significant change' criteria and risk assessment trigger",
            "Change request log with risk assessment checkbox or approval gate",
            "Risk register update linked to a specific significant change event",
            "AWS Config or Azure Policy change history report",
            "Post-change risk review records for at least two significant changes in the period",
            "Security review sign-off on a major infrastructure or product change"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    # -------------------------------------------------------------------------
    # CC4 — Monitoring Activities
    # -------------------------------------------------------------------------
    {
        "id": "CC4.1",
        "domain": "Monitoring Activities",
        "domainCode": "CC4",
        "title": "COSO Principle 16: Conducts Ongoing and Separate Evaluations",
        "description": "The entity selects, develops, and performs ongoing and separate evaluations to ascertain whether the components of internal control are present and functioning. Evaluations may be continuous monitoring or periodic assessments.",
        "guidance": "Continuous monitoring should be automated wherever possible using configuration compliance tools and security monitoring platforms. Periodic evaluations such as internal audits and control self-assessments provide a complementary layer of assurance.",
        "implementationGuide": "Deploy AWS Config Rules or Azure Policy initiatives to perform continuous compliance checks against your control baselines, with results feeding into a compliance dashboard in Vanta or Secureframe. Schedule quarterly control self-assessments in AuditBoard or OneTrust GRC, assigning control owners to certify their controls and upload evidence. Conduct at least one independent internal audit per year using a structured audit program. The 'done' state is a continuous monitoring dashboard showing daily control status, plus quarterly self-assessment completion records and an annual internal audit report. A common failure mode is relying solely on periodic assessments without continuous monitoring, resulting in weeks-long gaps where control failures go undetected.",
        "exampleEvidence": [
            "Continuous monitoring dashboard from Vanta, Drata, or AWS Config with daily check results",
            "Quarterly control self-assessment completion records with owner certifications",
            "Internal audit plan and most recent audit report",
            "Control monitoring cadence schedule approved by management",
            "Automated alert configuration for control failures with evidence of alert handling",
            "Trend analysis of control health metrics over the past four quarters"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC4.2",
        "domain": "Monitoring Activities",
        "domainCode": "CC4",
        "title": "COSO Principle 17: Evaluates and Communicates Deficiencies",
        "description": "The entity evaluates and communicates internal control deficiencies in a timely manner to parties responsible for taking corrective action, including senior management and the board as appropriate.",
        "guidance": "A formal deficiency management process should define severity classifications, escalation thresholds, and remediation SLAs. Significant deficiencies and material weaknesses must be escalated to the board or audit committee.",
        "implementationGuide": "Use AuditBoard or ServiceNow GRC to track deficiencies from identification through remediation, with automated escalation to management when SLAs are breached. Configure Vanta or Drata to generate weekly deficiency summary reports emailed to the CISO and control owners. Define severity tiers (observation, deficiency, significant deficiency, material weakness) in the deficiency management policy with corresponding escalation paths. The 'done' state is a deficiency register with zero items past their remediation due date, management receiving weekly status reports, and the board receiving a quarterly deficiency summary. A common failure mode is tracking deficiencies in a spreadsheet with no automated escalation, resulting in aged findings that are never remediated.",
        "exampleEvidence": [
            "Deficiency management policy with severity classifications and remediation SLAs",
            "Deficiency register showing open and closed items with due dates and owners",
            "Automated escalation log or email records for overdue deficiencies",
            "Board or audit committee presentation of significant deficiencies",
            "Remediation evidence for at least three closed deficiencies in the period",
            "Trend report of deficiencies raised, remediated, and outstanding by quarter"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    # -------------------------------------------------------------------------
    # CC5 — Control Activities
    # -------------------------------------------------------------------------
    {
        "id": "CC5.1",
        "domain": "Control Activities",
        "domainCode": "CC5",
        "title": "COSO Principle 10: Selects and Develops Control Activities",
        "description": "The entity selects and develops control activities that contribute to the mitigation of risks to the achievement of objectives to acceptable levels. Controls should be designed considering the cost-benefit relationship.",
        "guidance": "Control activities should be selected based on the risk assessment, with each significant risk having at least one mitigating control. The control design should specify whether the control is preventive or detective, manual or automated, and define the frequency and operator.",
        "implementationGuide": "Map each risk in your risk register to one or more controls in your control framework within OneTrust GRC or Tugboat Logic, ensuring no significant risk is unmitigated. Use Vanta or Secureframe to automate the design and monitoring of technical controls, leveraging integrations with AWS, GitHub, and Okta to validate controls are operating as designed. Document the control design in a control matrix specifying type, frequency, owner, and testing approach. The 'done' state is a control matrix covering all significant risks, each control with a defined operator and testing schedule, and automated controls validated via continuous monitoring. A common failure mode is selecting controls that look good on paper but are never tested for design effectiveness—auditors will find the controls exist but cannot confirm they actually work.",
        "exampleEvidence": [
            "Control matrix mapping risks to controls with type, frequency, and owner fields",
            "Risk-to-control traceability report showing no uncovered significant risks",
            "Vanta or Secureframe control library with integration status per control",
            "Control design documentation for at least five key controls",
            "Management review and approval of the control selection process",
            "Cost-benefit analysis or rationale for manual vs. automated control selection"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC5.2",
        "domain": "Control Activities",
        "domainCode": "CC5",
        "title": "COSO Principle 11: Selects and Develops General Controls Over Technology",
        "description": "The entity selects and develops general control activities over technology to support the achievement of objectives. This includes controls over acquisition, development, and maintenance of technology as well as access and security controls.",
        "guidance": "Technology general controls (ITGCs) should address access management, change management, IT operations, and program development. These controls form the foundation upon which automated application controls depend.",
        "implementationGuide": "Implement ITGCs using a combination of Okta for identity and access management, GitHub or GitLab for change management with required code reviews and branch protections, and AWS Config or Azure Policy for infrastructure compliance. Onboard all three domains into Vanta or Drata so that ITGC status is continuously monitored and evidence is auto-collected. Define a formal ITGC assessment that is performed quarterly using AuditBoard. The 'done' state is all four ITGC domains (access, change, operations, development) covered by documented and tested controls, with continuous monitoring alerts in place. A common failure mode is strong application-layer controls built on weak ITGCs—auditors will test ITGCs first, and a failure there will cast doubt on all automated controls built on top of them.",
        "exampleEvidence": [
            "ITGC assessment results covering access, change, operations, and program development domains",
            "Okta or equivalent IAM platform configuration showing MFA enforcement",
            "GitHub/GitLab branch protection rules requiring code review and CI/CD checks",
            "AWS Config or Azure Policy baseline rule set with compliance report",
            "Change management process documentation with approval workflow evidence",
            "ITGC testing workpapers from the most recent assessment period"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC5.3",
        "domain": "Control Activities",
        "domainCode": "CC5",
        "title": "COSO Principle 12: Deploys Through Policies and Procedures",
        "description": "The entity deploys control activities through policies that establish what is expected and procedures that put policies into action. Policies and procedures should be current, communicated, and enforced.",
        "guidance": "Each policy should have an owner, review cycle, approval process, and enforcement mechanism. Procedures should provide enough detail for a competent person to execute the control consistently without additional guidance.",
        "implementationGuide": "Maintain the policy library in Confluence or SharePoint with mandatory annual review workflows and approval routing to the appropriate executive owner. Use Vanta or Drata to track policy review dates and automatically flag policies approaching or past their review deadline. When policies are updated, trigger acknowledgement workflows so all in-scope personnel confirm they have read the new version. The 'done' state is 100% of in-scope policies reviewed within their defined cycle, each with a named owner, approval signature, and version history. A common failure mode is having a large policy library where 30–40% of policies are more than two years old and have no designated reviewer, making it impossible to demonstrate the policies are actively maintained.",
        "exampleEvidence": [
            "Policy library index with last review date, owner, and approval status for each policy",
            "Annual policy review completion log with sign-off from each policy owner",
            "Version history for at least three key policies showing updates and approvals",
            "Automated policy review reminder log from Vanta, Drata, or workflow tool",
            "Employee policy acknowledgement records for the most recently updated policies",
            "Procedure documents with step-by-step instructions for at least two key controls"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    # -------------------------------------------------------------------------
    # CC6 — Logical and Physical Access Controls
    # -------------------------------------------------------------------------
    {
        "id": "CC6.1",
        "domain": "Logical and Physical Access Controls",
        "domainCode": "CC6",
        "title": "Logical Access Security Software, Infrastructure, and Architectures",
        "description": "The entity implements logical access security software, infrastructure, and architectures over protected information assets to protect them from security events to meet the entity's objectives. This includes identifying and authenticating users, restricting access to information assets, and logging access activity.",
        "guidance": "Access control architecture should follow the principle of least privilege, with all access granted based on documented business need. Multi-factor authentication should be required for all human access to production systems and privileged accounts.",
        "implementationGuide": "Enforce MFA and least-privilege access using Okta or Azure Active Directory with Conditional Access policies, ensuring all production system access requires phishing-resistant MFA (e.g., FIDO2 or Okta Verify). Integrate the identity provider with Vanta or Drata for continuous access control monitoring and automated evidence collection. Implement Privileged Access Management using CyberArk or HashiCorp Vault to control and audit privileged account usage. The 'done' state is 100% of users with production access enrolled in MFA, zero shared or service accounts with interactive login enabled, and access logs retained for at least 12 months. A common failure mode is MFA enforcement with exceptions for service accounts or legacy systems, creating backdoor access paths.",
        "exampleEvidence": [
            "MFA enrollment report showing 100% coverage for production system access",
            "Okta or Azure AD Conditional Access policy configuration screenshots",
            "Privileged account inventory with PAM tool enrollment status",
            "Access log retention configuration and sample log export",
            "Least-privilege access control policy with role-based access matrix",
            "Quarterly access review results for production systems"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC6.2",
        "domain": "Logical and Physical Access Controls",
        "domainCode": "CC6",
        "title": "Prior to Issuing System Credentials and Granting System Access",
        "description": "Prior to issuing system credentials and granting system access, the entity registers and authorizes new internal and external users whose access is administered by the entity. User credentials are protected to prevent unauthorized access.",
        "guidance": "Access provisioning must follow a formal request and approval workflow, with access granted only after documented business justification and manager approval. New user provisioning should be triggered by HR events and linked to a unique identity.",
        "implementationGuide": "Automate user provisioning and deprovisioning using Okta Lifecycle Management or Microsoft Entra Governance, triggered by HRIS events from Workday or BambooHR. Require manager and system owner approval for all access requests via a ticketing workflow in Jira Service Management or ServiceNow. Integrate provisioning workflows with Vanta or Secureframe to automatically collect evidence of approvals. The 'done' state is every user account linked to an approved access request ticket, zero accounts without a corresponding active employee record, and deprovisioning completed within 24 hours of termination. A common failure mode is provisioning access correctly at onboarding but failing to revoke access promptly at offboarding, leaving orphaned accounts.",
        "exampleEvidence": [
            "Access request and approval tickets for a sample of new users provisioned in the period",
            "Okta or Azure AD lifecycle management configuration showing HRIS integration",
            "User provisioning SLA and evidence of adherence (e.g., time-to-provision report)",
            "Offboarding checklist with access revocation steps and sign-off",
            "Terminated employee access revocation report showing time-to-deprovision",
            "Access provisioning policy defining approval requirements by system sensitivity tier"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC6.3",
        "domain": "Logical and Physical Access Controls",
        "domainCode": "CC6",
        "title": "Removes Access to Protected Information Assets When Appropriate",
        "description": "The entity authorizes, modifies, or removes access to information systems and related assets when circumstances warrant such action, including changes in job responsibilities and terminations.",
        "guidance": "Access should be promptly reviewed and modified or revoked whenever a user changes roles, is terminated, or no longer has a business need for the access. A periodic access review process should catch any access that was not removed through the normal lifecycle process.",
        "implementationGuide": "Configure automated deprovisioning in Okta or SailPoint Identity Governance triggered by status changes in the HRIS, with a target deprovisioning time of 4 hours for terminations. Use Vanta or Drata to run a monthly automated check for accounts belonging to former employees or users with stale access. Conduct quarterly user access reviews (UARs) in the IAM platform, requiring managers to certify or revoke each direct report's access entitlements. The 'done' state is zero active accounts for terminated employees, all role-change access modifications completed within five business days, and quarterly UAR completion at 100%. A common failure mode is having deprovisioning rely on a manual HR-to-IT notification process that is frequently delayed or skipped during busy periods.",
        "exampleEvidence": [
            "Automated deprovisioning trigger configuration from HRIS to IAM platform",
            "Terminated employee access revocation report for the audit period",
            "Quarterly user access review (UAR) completion records with manager certifications",
            "Role-change access modification tickets with completion timestamps",
            "Stale access report showing zero accounts for terminated users",
            "Access removal policy with defined SLAs for different termination scenarios"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC6.4",
        "domain": "Logical and Physical Access Controls",
        "domainCode": "CC6",
        "title": "Restricts Physical Access",
        "description": "The entity restricts physical access to facilities and protected information assets to authorized individuals to meet the entity's objectives. Physical access controls include perimeter security, entry controls, and monitoring.",
        "guidance": "Physical access to data centers and server rooms should be restricted to personnel with a documented business need, enforced via badge readers or biometric controls, and monitored via CCTV. Visitor access should be logged and escorted.",
        "implementationGuide": "Implement badge-based access control systems (e.g., Brivo or Verkada) for all facilities hosting production infrastructure, with access rights managed through the same provisioning workflow as logical access. For cloud-hosted environments using AWS or Azure, document the data center physical security controls provided by the cloud provider using their compliance documentation (e.g., SOC 2 reports, ISO 27001 certificates). Conduct quarterly physical access reviews to ensure badge access lists match current employee rosters. The 'done' state is a current physical access list for each facility, quarterly access reviews completed, and visitor log maintained for at least 12 months. A common failure mode is failing to revoke physical badge access at employee termination, even when logical access is revoked, leaving a physical security gap.",
        "exampleEvidence": [
            "Badge access system configuration showing restricted access zones",
            "Physical access list for production facilities with review date",
            "Visitor log for production facility or data center for the audit period",
            "Cloud provider SOC 2 or ISO 27001 report covering physical security (e.g., AWS, Azure)",
            "CCTV retention policy and confirmation of camera coverage at entry points",
            "Quarterly physical access review records with revocations logged"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC6.5",
        "domain": "Logical and Physical Access Controls",
        "domainCode": "CC6",
        "title": "Discontinues Logical and Physical Protections Over Assets When Appropriate",
        "description": "The entity discontinues logical and physical protections over physical assets, including media, when the assets are no longer in use or are transferred outside the entity's control.",
        "guidance": "Decommissioning procedures should include secure data erasure or physical destruction of media, with certificates of destruction retained. Assets transferred to third parties should be sanitized according to NIST SP 800-88 or equivalent standard.",
        "implementationGuide": "Implement an asset disposal workflow in ServiceNow or Jira that requires data sanitization certification before any asset is decommissioned or transferred, using tools like Blancco or DBAN for disk wiping. For cloud environments (AWS, Azure, GCP), document the data destruction procedures for decommissioned storage volumes and retain screenshots or API logs confirming secure deletion. Track all physical assets in an asset management system (e.g., Snipe-IT or Jamf) and reconcile disposals against the asset register quarterly. The 'done' state is a certificate of destruction or sanitization record for every decommissioned asset, and an asset register reconciled within the last quarter. A common failure mode is disposing of office laptops through an unvetted IT asset disposal (ITAD) vendor without requiring certificates of data destruction.",
        "exampleEvidence": [
            "Certificate of data destruction or secure erasure for decommissioned media/devices",
            "Asset disposal policy referencing NIST SP 800-88 or equivalent standard",
            "Asset register reconciliation report showing disposals matched to destruction records",
            "Cloud storage volume deletion confirmation logs (e.g., AWS S3 deletion audit trail)",
            "ITAD vendor contract requiring certificates of destruction",
            "Decommission checklist for hardware assets with sign-off fields"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC6.6",
        "domain": "Logical and Physical Access Controls",
        "domainCode": "CC6",
        "title": "Implements Logical Access Security Measures to Protect Against Threats from Sources Outside Its System Boundaries",
        "description": "The entity implements logical access security measures to protect against threats from sources outside its system boundaries. This includes controls to protect against unauthorized external access, including controls for perimeter security.",
        "guidance": "Network perimeter controls should include firewalls, web application firewalls, and intrusion detection or prevention systems. External-facing services should be regularly scanned for vulnerabilities and exposed attack surface minimized.",
        "implementationGuide": "Deploy a Web Application Firewall (e.g., AWS WAF, Cloudflare WAF) in front of all internet-facing applications and configure alerts for high-severity rule triggers in Splunk or Microsoft Sentinel. Run authenticated vulnerability scans with Qualys or Tenable.io at least monthly, with findings triaged and remediated within defined SLAs (critical: 15 days, high: 30 days). Integrate scan results with Vanta or Drata for automatic evidence collection and remediation tracking. The 'done' state is WAF coverage for all public endpoints, monthly vulnerability scans with no unresolved critical findings older than 15 days, and a documented network segmentation diagram. A common failure mode is deploying a WAF in detection-only (monitor) mode rather than prevention mode, negating its protective value.",
        "exampleEvidence": [
            "WAF configuration showing prevention mode rules and coverage of all public endpoints",
            "Monthly vulnerability scan reports from Qualys or Tenable.io",
            "Vulnerability remediation SLA policy and compliance report showing no overdue criticals",
            "Network segmentation diagram showing DMZ and internal network zones",
            "Firewall rule set review records showing last review date and approver",
            "Intrusion detection or prevention system (IDS/IPS) alert configuration and sample alert log"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC6.7",
        "domain": "Logical and Physical Access Controls",
        "domainCode": "CC6",
        "title": "Restricts Transmission, Movement, and Removal of Information",
        "description": "The entity restricts the transmission, movement, and removal of information to authorized internal and external users and processes, and protects it during transmission to meet the entity's objectives.",
        "guidance": "Data in transit must be encrypted using current standards (TLS 1.2 or higher). Controls should prevent unauthorized data exfiltration through email, USB, or cloud storage channels, and data loss prevention (DLP) tools should monitor for policy violations.",
        "implementationGuide": "Enforce TLS 1.2+ for all data in transit using AWS Certificate Manager or Azure Key Vault to manage certificates, with automated expiry alerts configured in Vanta or Drata. Deploy a DLP solution such as Microsoft Purview DLP or Netskope to monitor and block unauthorized transmission of sensitive data (e.g., PII, financial records) via email, web uploads, or cloud sync. Configure USB port restrictions through endpoint management (e.g., Jamf, Microsoft Intune). The 'done' state is 100% of external API and web endpoints using TLS 1.2+, DLP policies active on all corporate endpoints, and zero unresolved high-severity DLP policy violations older than 5 business days. A common failure mode is enforcing encryption on new infrastructure while leaving legacy internal services communicating over plaintext HTTP.",
        "exampleEvidence": [
            "TLS configuration scan results showing 100% of endpoints using TLS 1.2 or higher",
            "SSL/TLS certificate inventory with expiry dates and renewal alerts",
            "DLP policy configuration screenshots and recent violation report",
            "Endpoint management policy showing USB restriction enforcement (Jamf/Intune)",
            "Data in transit encryption policy",
            "DLP incident log with triage and resolution records"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC6.8",
        "domain": "Logical and Physical Access Controls",
        "domainCode": "CC6",
        "title": "Implements Controls to Prevent or Detect and Act Upon the Introduction of Unauthorized or Malicious Software",
        "description": "The entity implements controls to prevent or detect and act upon the introduction of unauthorized or malicious software to meet the entity's objectives. This includes anti-malware and application whitelisting controls.",
        "guidance": "Endpoint protection should be deployed on all managed devices, with definitions kept current and scans scheduled at least daily. Software deployment should be controlled through a formal process, with developer workstations prohibited from deploying directly to production.",
        "implementationGuide": "Deploy CrowdStrike Falcon or SentinelOne EDR on all managed endpoints with real-time threat prevention enabled and alerts forwarded to Splunk or Microsoft Sentinel. Enforce software deployment controls through a CI/CD pipeline (e.g., GitHub Actions with signed commits and required approvals) that prevents direct production deployments. Integrate EDR coverage reporting with Vanta or Secureframe to automatically flag devices missing endpoint protection. The 'done' state is 100% EDR agent coverage on managed devices, zero devices with definitions more than 24 hours old, and no direct production deployments outside the approved CI/CD pipeline. A common failure mode is achieving high EDR coverage for laptops but missing server endpoints or containerized workloads running in AWS or GCP.",
        "exampleEvidence": [
            "EDR coverage report from CrowdStrike or SentinelOne showing 100% of managed endpoints",
            "Malware/threat detection policy and agent configuration settings",
            "Sample EDR alert and incident response record",
            "CI/CD pipeline configuration showing required approvals and no direct production push capability",
            "Software installation policy prohibiting unauthorized software on managed devices",
            "Most recent endpoint compliance report showing AV definition age distribution"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    # -------------------------------------------------------------------------
    # CC7 — System Operations
    # -------------------------------------------------------------------------
    {
        "id": "CC7.1",
        "domain": "System Operations",
        "domainCode": "CC7",
        "title": "Detects and Monitors for New Vulnerabilities",
        "description": "To meet its objectives, the entity uses detection and monitoring procedures to identify changes to configurations that result in the introduction of new vulnerabilities, and considers opportunities to improve the entity's ability to meet its objectives.",
        "guidance": "Vulnerability management should include continuous scanning of the infrastructure, timely patching based on risk severity, and exception management for patches that cannot be immediately applied. Asset inventory must be current for scanning to be effective.",
        "implementationGuide": "Run continuous vulnerability scanning using Qualys VMDR or Tenable.io, covering all cloud assets discovered via AWS, Azure, or GCP API integrations. Feed scan results into your SIEM (Splunk or Microsoft Sentinel) for correlation and into Vanta or Drata for compliance evidence collection. Define patch SLAs by severity (critical: 15 days, high: 30 days, medium: 90 days) in the vulnerability management policy and track compliance against those SLAs. The 'done' state is scan coverage above 98% of discovered assets, zero overdue critical or high findings, and a current asset inventory. A common failure mode is scanning only internet-facing assets while ignoring internal servers, databases, and containers, which represent significant risk.",
        "exampleEvidence": [
            "Vulnerability scan coverage report showing percentage of assets scanned",
            "Open vulnerability report sorted by severity and age, with no overdue criticals",
            "Patch management SLA policy with severity-to-SLA mapping",
            "Asset inventory used as scan target list with last update date",
            "Vulnerability remediation tracking dashboard with trend data",
            "Exception or risk acceptance records for vulnerabilities that cannot be patched immediately"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC7.2",
        "domain": "System Operations",
        "domainCode": "CC7",
        "title": "Monitors System Components for Anomalous Behavior",
        "description": "The entity monitors system components and the operation of those components for anomalies that are indicative of malicious acts, natural disasters, and errors affecting the entity's ability to meet its objectives.",
        "guidance": "Monitoring should cover authentication events, privileged access usage, network traffic anomalies, and system performance deviations. Alerts should be tuned to minimize false positives while ensuring high-confidence alerts are acted upon within defined SLAs.",
        "implementationGuide": "Centralize log collection from all production systems, cloud environments (AWS CloudTrail, Azure Monitor), and security tools into a SIEM such as Splunk or Microsoft Sentinel. Develop a detection rule set covering MITRE ATT&CK techniques relevant to your threat model and configure automated alerting with severity-based response SLAs. Integrate SIEM alerts with a SOAR platform or PagerDuty for on-call escalation. The 'done' state is 100% of in-scope systems sending logs to the SIEM with no gaps in log coverage, alert SLAs being met for 95%+ of high-severity alerts, and monthly tuning reviews to reduce false positives. A common failure mode is enabling logging but not alerting, resulting in a SIEM full of data that no one is actively reviewing.",
        "exampleEvidence": [
            "SIEM data source inventory showing all in-scope systems onboarded",
            "Detection rule set mapped to MITRE ATT&CK with last review date",
            "Alert SLA policy and compliance report showing time-to-response by severity",
            "Sample high-severity alert and incident investigation record",
            "Log retention configuration confirming minimum 12-month retention",
            "Monthly SIEM tuning review records showing false positive reduction"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC7.3",
        "domain": "System Operations",
        "domainCode": "CC7",
        "title": "Implements Incident Response Program",
        "description": "The entity evaluates security events to determine whether they could or have resulted in a failure of the entity to meet its objectives (security incidents) and, if so, takes actions to prevent or address such failures.",
        "guidance": "An incident response plan should define roles, responsibilities, and procedures for detecting, containing, eradicating, and recovering from security incidents. The plan must be tested at least annually through tabletop exercises or simulations.",
        "implementationGuide": "Develop and maintain an incident response plan in Confluence or SharePoint aligned to NIST SP 800-61r2 phases (Preparation, Detection, Containment, Eradication, Recovery, Lessons Learned). Use PagerDuty or OpsGenie for on-call alerting and JIRA or ServiceNow for incident ticket management and post-incident review tracking. Conduct annual tabletop exercises with scenarios relevant to your threat model and document findings in Vanta or AuditBoard. The 'done' state is a tested, board-approved IRP updated within the past 12 months, an annual tabletop exercise with documented results, and all incidents tracked in a ticketing system with post-incident reviews for significant events. A common failure mode is having an IRP that names roles but never tests whether those individuals actually know what to do during an incident.",
        "exampleEvidence": [
            "Incident response plan (IRP) with version date and executive approval signature",
            "Annual tabletop exercise scenario, participants list, and findings report",
            "Incident ticket log from the audit period with severity, timeline, and resolution notes",
            "Post-incident review (PIR) records for significant incidents",
            "On-call escalation configuration in PagerDuty or OpsGenie",
            "Incident classification matrix defining severity levels and response SLAs"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC7.4",
        "domain": "System Operations",
        "domainCode": "CC7",
        "title": "Responds to Security Incidents",
        "description": "The entity responds to identified security incidents by executing a defined incident response program to understand, contain, and remediate the incident and restore the affected system. Stakeholders are notified as appropriate.",
        "guidance": "Incident response execution should be documented in real time via an incident ticket, with containment actions, timeline, and communications logged. Notification obligations to customers and regulators should be tracked and met within contractual and legal timeframes.",
        "implementationGuide": "Establish a Security Operations Center (SOC) function or managed detection and response (MDR) service using CrowdStrike Falcon Complete or Arctic Wolf to ensure 24/7 incident response coverage. Use ServiceNow or Jira for incident ticket management, with mandatory fields for containment actions, affected systems, root cause, and breach determination. Maintain a breach notification playbook that maps incident types to notification obligations and integrates with OneTrust's Privacy Incident Management module for GDPR/CCPA breach notifications. The 'done' state is every security incident documented in a ticket with a root cause determination, breach assessment completed, and regulatory notifications sent within required timeframes where applicable. A common failure mode is containing and recovering from an incident without completing a formal root cause analysis, meaning the same vulnerability is exploited again.",
        "exampleEvidence": [
            "Security incident tickets from the audit period with full timeline and resolution",
            "Breach notification playbook with regulatory timeframe mapping",
            "Root cause analysis (RCA) for at least one significant incident",
            "Customer or regulatory notification records for any breach events",
            "MDR or SOC service contract and coverage scope documentation",
            "Incident response SLA compliance report"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC7.5",
        "domain": "System Operations",
        "domainCode": "CC7",
        "title": "Identifies, Develops, and Implements Remediation Activities to Recover from Identified Security Incidents",
        "description": "The entity identifies, develops, and implements activities to recover from identified security incidents and improve its security posture. This includes identifying the root cause and implementing corrective actions to prevent recurrence.",
        "guidance": "Post-incident remediation should result in documented corrective actions assigned to owners with due dates. Lessons learned should feed back into the risk assessment, incident response plan, and control framework.",
        "implementationGuide": "Conduct a formal post-incident review (PIR) using a standardized template in Confluence or Notion for every high or critical severity incident, identifying root cause, contributing factors, and corrective actions. Track corrective actions in Jira or ServiceNow with assigned owners and due dates, escalating overdue items to the CISO. Feed recurring incident themes back into the annual risk assessment in OneTrust GRC or Tugboat Logic. The 'done' state is a completed PIR for every high/critical incident, all corrective actions tracked to closure, and at least one control or process improvement documented per significant incident. A common failure mode is completing the PIR but not following through on corrective actions—they are written in the document but never formally tracked or closed.",
        "exampleEvidence": [
            "Post-incident review templates and completed PIRs for high/critical incidents",
            "Corrective action tracking report with owners, due dates, and closure status",
            "Evidence of control or process improvements implemented following incidents",
            "Lessons learned incorporated into updated IRP or risk register",
            "CISO or management sign-off on corrective action closure",
            "Trend analysis of incident types showing reduction in recurring issues"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    # -------------------------------------------------------------------------
    # CC8 — Change Management
    # -------------------------------------------------------------------------
    {
        "id": "CC8.1",
        "domain": "Change Management",
        "domainCode": "CC8",
        "title": "Manages Changes to Infrastructure, Data, Software, and Procedures",
        "description": "The entity authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes to infrastructure, data, software, and procedures to meet its objectives. Changes include both planned and emergency changes.",
        "guidance": "A formal change management process should require authorization before any change is deployed to production, with testing and peer review completed first. Emergency changes should follow an expedited process that still ensures a post-deployment review.",
        "implementationGuide": "Enforce change management controls through GitHub or GitLab with branch protection rules requiring at least one peer review and passing CI/CD pipeline checks before merges to main. For infrastructure changes, use Terraform with a required plan-and-apply workflow gated by approvals in GitHub Actions or AWS CodePipeline. Track all changes in Jira with links to deployment artifacts, and integrate with Vanta or Drata to auto-collect change management evidence. The 'done' state is zero direct commits to main branch, 100% of production deployments traceable to an approved change ticket, and emergency changes receiving post-deployment review within 24 hours. A common failure mode is enforcing the process for planned changes but allowing developers to bypass approval gates for 'urgent' fixes, which become a significant exception population that auditors will examine.",
        "exampleEvidence": [
            "GitHub or GitLab branch protection configuration requiring peer review and CI checks",
            "Change request tickets from the audit period with approval records",
            "CI/CD pipeline configuration with required approval gates before production deployment",
            "Emergency change procedure with post-deployment review requirements",
            "Change management policy defining change types, approval requirements, and testing standards",
            "Deployment log linked to approved change tickets for a sample of production releases"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    # -------------------------------------------------------------------------
    # CC9 — Risk Mitigation
    # -------------------------------------------------------------------------
    {
        "id": "CC9.1",
        "domain": "Risk Mitigation",
        "domainCode": "CC9",
        "title": "Identifies, Selects, and Develops Risk Mitigation Activities",
        "description": "The entity identifies, selects, and develops risk mitigation activities for risks arising from potential business disruptions. Mitigation activities include business continuity planning, disaster recovery, and insurance.",
        "guidance": "Business continuity and disaster recovery plans should be based on a Business Impact Analysis (BIA) that defines RTOs and RPOs for critical systems. Plans must be tested at least annually through tabletop exercises or actual failover testing.",
        "implementationGuide": "Conduct a Business Impact Analysis (BIA) annually, documented in OneTrust GRC or AuditBoard, to define RTO/RPO targets for each critical system based on business impact. Develop and maintain Business Continuity Plans (BCPs) and DR runbooks in Confluence, aligned to BIA outcomes, and test them through annual DR exercises that include actual failover to backup environments in AWS or Azure. Track exercise results and remediation items in Vanta or your GRC platform. The 'done' state is a completed BIA, approved BCP and DR plan updated within 12 months, annual DR test with documented results, and all findings remediated or accepted. A common failure mode is having a BCP and DR plan that exist on paper but have never been tested, so the organization discovers recovery gaps only during an actual outage.",
        "exampleEvidence": [
            "Business Impact Analysis (BIA) report with RTO/RPO definitions per critical system",
            "Business Continuity Plan (BCP) with version date and executive approval",
            "Disaster Recovery (DR) plan and runbooks for critical systems",
            "Annual DR test exercise report with test scope, results, and findings",
            "DR test remediation tracking records",
            "Cyber insurance policy summary showing coverage type and limits"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "CC9.2",
        "domain": "Risk Mitigation",
        "domainCode": "CC9",
        "title": "Assesses and Manages Risks from Vendors and Business Partners",
        "description": "The entity assesses and manages risks associated with vendors and business partners. This includes identifying vendor risks, conducting due diligence, and monitoring ongoing performance.",
        "guidance": "A vendor risk management program should tier vendors by the criticality and sensitivity of their access, with higher-tier vendors subject to more rigorous due diligence and monitoring. Security questionnaires, SOC 2 reports, and contractual security obligations should be reviewed at onboarding and annually.",
        "implementationGuide": "Implement a formal vendor risk management program using OneTrust Third-Party Risk Management or Vanta's vendor management module to track vendor tiers, security questionnaire responses, and SOC 2 report currency. Require critical vendors to provide their SOC 2 Type II report annually and use Whistic or ProcessUnity to automate the collection and review of vendor security documentation. Include data processing agreements (DPAs) and security addenda in all vendor contracts managed through DocuSign or ContractSafe. The 'done' state is every critical vendor having a current SOC 2 report or equivalent, a completed security questionnaire, and a signed DPA. A common failure mode is completing vendor due diligence at onboarding but not scheduling annual re-assessments, so vendor risk profiles become stale.",
        "exampleEvidence": [
            "Vendor inventory with tier classifications and last assessment dates",
            "Security questionnaire responses for critical vendors",
            "Current SOC 2 Type II reports or equivalent for critical vendors",
            "Vendor contract with security addendum and DPA (redacted sample)",
            "Annual vendor re-assessment completion log",
            "Vendor risk management policy defining tiers, due diligence requirements, and monitoring frequency"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    # -------------------------------------------------------------------------
    # A — Availability
    # -------------------------------------------------------------------------
    {
        "id": "A1.1",
        "domain": "Availability",
        "domainCode": "A",
        "title": "Manages Capacity Demand and Designs Availability Controls",
        "description": "The entity maintains, monitors, and evaluates current processing capacity and use of system components (infrastructure, data, and software) to manage capacity demand and to enable the implementation of additional capacity to help meet its objectives.",
        "guidance": "Capacity planning should be performed at least annually and reviewed quarterly, with alerts configured when usage thresholds are approached. Infrastructure should be designed with redundancy to eliminate single points of failure.",
        "implementationGuide": "Configure CloudWatch (AWS) or Azure Monitor to alert when CPU, memory, or storage utilization exceeds defined thresholds (e.g., 80%), and review capacity reports monthly in your operations meeting. Use auto-scaling groups in AWS or Azure VMSS to automatically provision additional capacity in response to demand spikes. Document the capacity planning process and current headroom in a capacity management report reviewed by engineering leadership quarterly. The 'done' state is alerting in place for all production systems, auto-scaling configured for stateless tiers, and a quarterly capacity report showing headroom against projected growth. A common failure mode is setting scaling policies based on stale traffic projections that don't account for business growth, leading to capacity exhaustion during peak periods.",
        "exampleEvidence": [
            "Capacity planning report with current utilization and projected growth over 12 months",
            "CloudWatch or Azure Monitor alerting configuration for capacity thresholds",
            "Auto-scaling policy configuration for production compute tiers",
            "Historical capacity trend charts showing utilization over the past 12 months",
            "Architecture diagram showing redundant components and no single points of failure",
            "Quarterly capacity review meeting records"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "A1.2",
        "domain": "Availability",
        "domainCode": "A",
        "title": "Manages Environmental Threats to Availability",
        "description": "The entity authorizes, designs, develops or acquires, implements, operates, approves, maintains, and monitors environmental protection software, infrastructure, and architectures to meet the entity's availability objectives.",
        "guidance": "Environmental controls for physical infrastructure should protect against power outages, fire, flooding, and extreme temperature. For cloud-hosted environments, environmental controls are managed by the cloud provider, and their compliance documentation should be reviewed.",
        "implementationGuide": "For cloud-hosted services on AWS or Azure, include environmental protection controls from the cloud provider's SOC 2 Type II report as part of your control environment, with the report reviewed and archived annually in Vanta or AuditBoard. Design multi-AZ or multi-region architectures in AWS to ensure availability is not dependent on a single physical facility. For any on-premises infrastructure, document UPS, generator, fire suppression, and HVAC controls with maintenance records. The 'done' state is a multi-AZ architecture for all critical services, current cloud provider compliance reports on file, and maintenance records for any on-premises environmental controls. A common failure mode is deploying services in a single AWS Availability Zone to save cost, creating a single point of failure for environmental events.",
        "exampleEvidence": [
            "AWS or Azure architecture diagram showing multi-AZ or multi-region deployment",
            "Cloud provider SOC 2 Type II report covering environmental controls (current year)",
            "On-premises data center environmental controls inspection report (if applicable)",
            "UPS and generator test records (if applicable)",
            "RTO/RPO targets and evidence of architecture alignment",
            "Disaster recovery test results validating multi-AZ failover capability"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "A1.3",
        "domain": "Availability",
        "domainCode": "A",
        "title": "Tests Recovery Plan Infrastructure and Data",
        "description": "The entity tests recovery plan infrastructure and data to help meet its availability objectives. Testing should validate that recovery time and recovery point objectives can be met.",
        "guidance": "Recovery testing should simulate realistic failure scenarios and validate that RTO and RPO targets are achievable. Test results should be documented with any gaps identified and remediated before the next test cycle.",
        "implementationGuide": "Conduct at least annual DR tests that include actual failover to backup environments in AWS or Azure, validating RTO and RPO targets documented in the BIA. Use AWS Resilience Hub or Azure Site Recovery to orchestrate and document failover tests. Track test results and remediation actions in AuditBoard or Vanta, and present a summary to executive leadership. The 'done' state is a completed annual DR test with documented evidence of RTO/RPO achievement, all gaps from the test assigned to owners with remediation due dates, and executive sign-off on results. A common failure mode is testing only the technical failover but not the end-to-end business recovery process, so operational teams are unprepared even when the infrastructure recovers successfully.",
        "exampleEvidence": [
            "Annual DR test plan with test scenarios mapped to critical system RTO/RPO targets",
            "DR test execution report with actual vs. target RTO/RPO results",
            "AWS Resilience Hub or Azure Site Recovery test run documentation",
            "Backup restoration test records showing successful data recovery",
            "Gap remediation tracking list from most recent DR test",
            "Executive sign-off on DR test results"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    # -------------------------------------------------------------------------
    # C — Confidentiality
    # -------------------------------------------------------------------------
    {
        "id": "C1.1",
        "domain": "Confidentiality",
        "domainCode": "C",
        "title": "Identifies and Maintains Confidential Information",
        "description": "The entity identifies and maintains confidential information to meet the entity's objectives related to confidentiality. This includes identifying confidential information and applying controls to protect it throughout its lifecycle.",
        "guidance": "A data classification policy should define what constitutes confidential information, and a data inventory or map should identify where confidential data is stored, processed, and transmitted. Access to confidential data should be restricted on a need-to-know basis.",
        "implementationGuide": "Implement data discovery and classification using Varonis or Microsoft Purview Information Protection to automatically identify and classify confidential data across cloud storage, email, and endpoints. Maintain a data inventory in OneTrust Data Mapping or a spreadsheet reviewed quarterly, showing data types, locations, processors, and access controls. Apply sensitivity labels using Microsoft Purview to confidential documents, triggering encryption and access restrictions. The 'done' state is a complete data inventory covering all production data stores, sensitivity labels applied to classified data, and access restricted to named roles. A common failure mode is performing a one-time data mapping exercise that is never updated as new data stores and processing activities are added.",
        "exampleEvidence": [
            "Data classification policy with definitions of confidentiality tiers",
            "Data inventory or data map showing confidential data locations and processors",
            "Microsoft Purview or Varonis classification scan results",
            "Sensitivity label configuration and sample classified document",
            "Access control list for systems containing confidential data",
            "Quarterly data inventory review record"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "C1.2",
        "domain": "Confidentiality",
        "domainCode": "C",
        "title": "Disposes of Confidential Information",
        "description": "The entity disposes of confidential information to meet the entity's objectives related to confidentiality. This includes ensuring confidential information is disposed of in a manner that prevents unauthorized use.",
        "guidance": "Confidential data should be disposed of according to a documented retention schedule, using methods that render the data unrecoverable. Data disposal should be auditable, with records maintained to demonstrate compliance with retention policy.",
        "implementationGuide": "Implement automated data retention and deletion workflows using AWS S3 Lifecycle Policies or Azure Blob Storage retention policies, configured to align with the data retention schedule. For structured databases, use scheduled deletion jobs with execution logs retained for audit. Manage the retention schedule and deletion records in OneTrust Privacy Management or a dedicated records management system, and review compliance quarterly. The 'done' state is a documented retention schedule, automated deletion mechanisms configured for all data stores, and deletion logs retained as evidence. A common failure mode is having a retention schedule but no automated enforcement—data is kept indefinitely because no one is manually purging it, increasing both regulatory and breach risk.",
        "exampleEvidence": [
            "Data retention and disposal policy with retention periods by data type",
            "AWS S3 Lifecycle Policy or Azure Blob retention policy configuration",
            "Automated deletion job execution logs showing scheduled deletions",
            "Certificate of destruction for physical media containing confidential information",
            "Quarterly data disposal compliance report",
            "Retention schedule review records showing last update date"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    # -------------------------------------------------------------------------
    # PI — Processing Integrity
    # -------------------------------------------------------------------------
    {
        "id": "PI1.1",
        "domain": "Processing Integrity",
        "domainCode": "PI",
        "title": "Obtains and Uses Information to Process Transactions",
        "description": "The entity obtains or generates, uses, and communicates relevant, quality information to support the use of other information produced by the entity to meet its processing integrity objectives.",
        "guidance": "Input validation controls should ensure only well-formed, authorized data enters processing systems. Data quality standards should define acceptable ranges, formats, and completeness requirements for inputs.",
        "implementationGuide": "Implement input validation at the API layer using tools like AWS API Gateway validation models or custom middleware, enforcing schema validation, field format rules, and authorization checks before data enters processing workflows. Log all validation failures in Splunk or Datadog and alert on anomalous rejection rates that may indicate attempted injection or bad data feeds. Document input validation rules in the application's technical specification, reviewed during code reviews enforced through GitHub pull request templates. The 'done' state is schema validation enabled on all external-facing API endpoints, validation failure alerting configured, and input validation rules documented and reviewed during PR. A common failure mode is implementing strong validation on web-facing endpoints but omitting it from internal service-to-service APIs, which attackers or buggy services can exploit.",
        "exampleEvidence": [
            "API input validation configuration (e.g., AWS API Gateway model schemas)",
            "Validation failure monitoring dashboard showing rejection rate trends",
            "Code review checklist item for input validation verification",
            "Technical specification documenting input validation rules by endpoint",
            "Penetration test report section covering injection and input validation",
            "Data quality metrics report showing input rejection rates by source"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "PI1.2",
        "domain": "Processing Integrity",
        "domainCode": "PI",
        "title": "Processes Inputs Completely, Accurately, and Timely",
        "description": "The entity implements policies and procedures over system inputs, including those received from third parties, and uses automated or manual controls to enable the detection of processing errors and omissions.",
        "guidance": "Processing controls should detect and report incomplete, inaccurate, or untimely processing, with exception handling procedures that prevent corrupt data from propagating through downstream systems.",
        "implementationGuide": "Implement transaction monitoring and reconciliation controls using Datadog or custom dashboards in AWS CloudWatch, alerting on processing job failures, record count mismatches, and latency SLA breaches. Use message queue dead-letter queues (DLQs) in AWS SQS or Azure Service Bus to capture failed messages for investigation and reprocessing. Document reconciliation procedures and run daily reconciliation checks for critical data pipelines, with results reviewed by the data operations team. The 'done' state is DLQs configured for all critical async processes, daily reconciliation checks completing successfully with no unresolved exceptions older than 24 hours, and processing SLA compliance tracked. A common failure mode is deploying DLQs without a process to monitor and drain them—failed messages accumulate unnoticed until data discrepancies surface downstream.",
        "exampleEvidence": [
            "Processing SLA metrics dashboard showing completion rate and latency",
            "Dead-letter queue (DLQ) monitoring configuration and alert records",
            "Daily reconciliation check results for critical data pipelines",
            "Exception handling policy and reprocessing procedure documentation",
            "Processing error log from the audit period with triage and resolution records",
            "Data pipeline architecture diagram showing checkpoints and error handling"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "PI1.3",
        "domain": "Processing Integrity",
        "domainCode": "PI",
        "title": "Stores and Maintains Data Accurately and Completely",
        "description": "The entity implements policies and procedures to store and maintain complete and accurate data that meets the entity's processing integrity objectives throughout its lifecycle.",
        "guidance": "Data integrity controls should protect stored data from unauthorized modification, corruption, and loss. Backup procedures should ensure data can be restored accurately to a defined recovery point.",
        "implementationGuide": "Enable database write-ahead logging and point-in-time recovery (PITR) for all production databases in AWS RDS or Azure SQL, with daily automated backups retained for at least 30 days. Implement checksums and integrity verification for data-at-rest in object storage using AWS S3 object integrity checks or Azure Storage data integrity validation. Monitor backup job success rates in Vanta or Drata and alert on failures. The 'done' state is automated daily backups for all production databases, PITR enabled, backup restoration tested quarterly, and data integrity checks running on all critical data stores. A common failure mode is enabling backups but never testing restoration—organizations discover backup corruption only when they actually need to restore.",
        "exampleEvidence": [
            "Database backup configuration showing PITR and retention settings",
            "Backup job success rate report from AWS RDS or Azure SQL",
            "Quarterly backup restoration test results with verified data integrity",
            "S3 or Azure Storage integrity check configuration",
            "Data retention policy defining storage requirements and backup frequency",
            "Storage integrity monitoring dashboard showing zero corruption events"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "PI1.4",
        "domain": "Processing Integrity",
        "domainCode": "PI",
        "title": "Provides Outputs Only to Intended Parties",
        "description": "The entity implements policies and procedures to make available or deliver output only to intended users in an accurate, timely, and complete manner. Output delivery controls prevent unauthorized disclosure.",
        "guidance": "Output controls should ensure reports, data exports, and API responses are delivered only to authenticated and authorized recipients. Sensitive outputs should be encrypted in transit and access-logged.",
        "implementationGuide": "Enforce output authorization at the API layer using OAuth 2.0 scopes and role-based access controls in Okta or Auth0, ensuring each data export or report is accessible only to users with the corresponding permission. Log all data access and export events in Splunk or Datadog and alert on bulk data exports that deviate from normal patterns (potential data exfiltration). Use DLP policies in Microsoft Purview or Netskope to prevent sensitive reports from being forwarded to unauthorized external recipients. The 'done' state is all output endpoints requiring authorization, bulk export events generating alerts for review, and no unauthorized output incidents in the audit period. A common failure mode is implementing row-level security in the database but forgetting to enforce equivalent controls in the API or reporting layer, allowing over-permissioned users to access data they should not see.",
        "exampleEvidence": [
            "API authorization policy and OAuth scope configuration",
            "Data export audit log showing authorized recipient for each export",
            "Bulk export alert configuration and sample alert review record",
            "DLP policy rules for output channels with recent violation report",
            "Report distribution access control list with review date",
            "Penetration test findings related to access control on output endpoints"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "PI1.5",
        "domain": "Processing Integrity",
        "domainCode": "PI",
        "title": "Stores Outputs Completely and Accurately",
        "description": "The entity implements policies and procedures to store outputs completely and accurately and retains such outputs to meet the entity's processing integrity objectives.",
        "guidance": "Output retention policies should define how long processed outputs must be kept, in what format, and with what access controls. Outputs subject to regulatory requirements should have tamper-evident storage.",
        "implementationGuide": "Configure immutable object storage (AWS S3 Object Lock or Azure Immutable Blob Storage) with compliance mode retention for outputs subject to regulatory requirements, preventing deletion or modification for the defined retention period. Manage the output retention schedule in OneTrust GRC or a records management system, with automated lifecycle policies enforcing deletion at the end of the retention period. Monitor storage integrity and access in CloudTrail or Azure Monitor. The 'done' state is immutable storage configured for regulated outputs, retention periods defined and enforced in lifecycle policies, and storage integrity monitoring active. A common failure mode is applying immutable storage policies retroactively without first reviewing what sensitive data already exists, potentially locking non-compliant data in place.",
        "exampleEvidence": [
            "AWS S3 Object Lock or Azure Immutable Blob Storage configuration for regulated outputs",
            "Output retention schedule with retention periods by output type",
            "Lifecycle policy configuration enforcing automated deletion at retention expiry",
            "Storage access log showing access to retained outputs is restricted to authorized roles",
            "Quarterly output retention compliance report",
            "Records management policy covering output storage and destruction requirements"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    # -------------------------------------------------------------------------
    # P — Privacy
    # -------------------------------------------------------------------------
    {
        "id": "P1.1",
        "domain": "Privacy",
        "domainCode": "P",
        "title": "Privacy Notice: Provides Notice to Data Subjects",
        "description": "The entity provides notice to data subjects about its privacy practices to meet the entity's objectives related to privacy. Notice is provided at or before the time of collection of personal information.",
        "guidance": "Privacy notices should be clear, concise, and written in plain language. They should describe what data is collected, the purposes of collection, how data is used and shared, and how individuals can exercise their rights.",
        "implementationGuide": "Draft and publish a privacy notice using OneTrust's Privacy Notice management module, ensuring it covers all required elements under applicable regulations (GDPR, CCPA). Version-control the notice in Confluence or SharePoint, with updates reviewed by legal counsel and published to the website within 30 days of any material change. Configure OneTrust to present the notice at the point of data collection (sign-up forms, checkout pages) with a consent mechanism. The 'done' state is a published, legally reviewed privacy notice with an effective date and version history, presented to users at the point of data collection. A common failure mode is publishing a boilerplate privacy notice that doesn't accurately reflect actual data practices, creating regulatory exposure when practices and notice don't align.",
        "exampleEvidence": [
            "Published privacy notice URL with effective date and version history",
            "Legal counsel review and approval of the privacy notice",
            "Screenshot of privacy notice presentation at point of data collection",
            "Privacy notice update procedure and change log",
            "OneTrust or equivalent privacy notice management configuration",
            "Privacy notice gap analysis against applicable regulatory requirements (GDPR, CCPA)"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "P2.1",
        "domain": "Privacy",
        "domainCode": "P",
        "title": "Choice and Consent: Communicates Choices Available Regarding Collection, Use, and Disclosure",
        "description": "The entity communicates choices available to the data subject and obtains implicit or explicit consent with respect to the collection, use, and disclosure of personal information. Consent is documented.",
        "guidance": "Consent mechanisms should be unambiguous, freely given, and as easy to withdraw as to give. Consent records must be maintained with sufficient detail to demonstrate when, how, and for what purpose consent was obtained.",
        "implementationGuide": "Implement a Consent Management Platform (CMP) such as OneTrust CMP or Osano to capture and store granular consent records per user, including timestamp, consent version, and specific purposes consented to. Integrate the CMP with your marketing automation platform (e.g., HubSpot, Marketo) to enforce consent-based suppression of communications. Configure consent withdrawal workflows that automatically suppress processing within 72 hours of a withdrawal request. The 'done' state is a deployed CMP capturing consent for all processing purposes, consent records queryable by user, and withdrawal automation tested and operational. A common failure mode is capturing consent for marketing communications but not for analytics or personalization processing, leaving those activities without a valid consent basis.",
        "exampleEvidence": [
            "CMP configuration showing consent categories and opt-in/opt-out mechanisms",
            "Sample consent record showing timestamp, version, and purpose",
            "Consent withdrawal workflow configuration and test evidence",
            "Marketing platform suppression list showing withdrawn consent applied",
            "Consent rate reporting dashboard",
            "Annual consent record audit confirming record retention and accuracy"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "P3.1",
        "domain": "Privacy",
        "domainCode": "P",
        "title": "Collection of Personal Information Consistent with Objectives",
        "description": "Personal information is collected consistent with the entity's objectives related to privacy. The entity collects personal information only as necessary to fulfill the stated purposes.",
        "guidance": "Data minimization principles should be applied to all new data collection, with a review process to determine whether each data element collected is necessary for the stated purpose. Existing data collection should be periodically reviewed against current business need.",
        "implementationGuide": "Conduct a Privacy Impact Assessment (PIA) for all new features or products that collect personal information, using OneTrust DPIA Manager or a structured PIA template in Confluence, before development begins. Embed a data minimization review step into the product design process (e.g., as a required Jira field or design review checklist item). Perform an annual review of collected data fields to identify elements no longer needed, using OneTrust Data Mapping to surface collection points. The 'done' state is a completed PIA for every new personal information collection activity, annual review of existing collection with documented justification for each field, and no personal data fields collected without a documented purpose. A common failure mode is skipping the PIA for 'small' feature additions that collectively result in significant scope creep in data collection.",
        "exampleEvidence": [
            "Privacy Impact Assessment (PIA) template and completed PIAs for new features",
            "Data minimization review checklist integrated into product design process",
            "Annual data collection review report with justification for each data element",
            "OneTrust data mapping showing collection points and purposes",
            "Product design documentation referencing data minimization decisions",
            "Jira or project management tickets showing PIA completion before launch"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "P3.2",
        "domain": "Privacy",
        "domainCode": "P",
        "title": "Explicit Consent for Sensitive Personal Information",
        "description": "The entity obtains explicit consent for collection of sensitive personal information consistent with the entity's objectives related to privacy.",
        "guidance": "Sensitive personal information (e.g., health data, financial data, biometrics, racial/ethnic origin) requires explicit, specific consent that is separate from general privacy terms acceptance. Consent should be granular, purpose-specific, and documented.",
        "implementationGuide": "Configure OneTrust CMP to present explicit, standalone consent forms for any collection of sensitive data categories, separate from general terms acceptance, with clear description of the sensitive data type and processing purpose. Map all sensitive data collection points in the OneTrust data inventory and verify each has an explicit consent mechanism in place. Store sensitive data consent records in an immutable log with timestamp, data category, and consent text version. The 'done' state is every sensitive data collection point mapped, each with a documented explicit consent mechanism, and consent records retained and queryable per individual. A common failure mode is treating sensitive data consent as a checkbox bundled with the general privacy notice, which fails the 'explicit and specific' requirement of GDPR Article 9.",
        "exampleEvidence": [
            "Sensitive data category inventory showing each category and its collection point",
            "Explicit consent form for sensitive data collection with standalone wording",
            "CMP configuration showing sensitive data consent as separate from general consent",
            "Sample sensitive data consent record with data category, timestamp, and consent text",
            "Legal review confirming explicit consent meets applicable regulatory requirements",
            "Annual audit of sensitive data collection points to confirm consent coverage"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "P4.1",
        "domain": "Privacy",
        "domainCode": "P",
        "title": "Use of Personal Information Consistent with Objectives",
        "description": "The entity limits the use of personal information to the purposes identified in the notice and for which implicit or explicit consent was obtained, consistent with the entity's privacy objectives.",
        "guidance": "Personal data should be used only for the purposes described in the privacy notice and for which consent was obtained. New processing uses should be evaluated for compatibility with original purposes before being implemented.",
        "implementationGuide": "Maintain a Record of Processing Activities (RoPA) in OneTrust or a structured spreadsheet that maps each data element to its collection purpose, legal basis, and permitted uses. Require a compatibility assessment before any new use of existing personal data, documented in a Privacy Review ticket in Jira. Conduct quarterly RoPA reviews to ensure processing activities remain aligned with declared purposes. The 'done' state is a complete, current RoPA, a documented compatibility assessment process, and quarterly reviews completed with sign-off from the DPO or privacy team. A common failure mode is using customer personal data for internal analytics or product testing without assessing whether that use is compatible with the original consent or contractual basis.",
        "exampleEvidence": [
            "Record of Processing Activities (RoPA) with data element, purpose, and legal basis",
            "Compatibility assessment template and completed assessments for new data uses",
            "Quarterly RoPA review records with DPO or privacy team sign-off",
            "Privacy policy or notice section describing permitted uses",
            "Training records for staff who handle personal data covering permissible uses",
            "Privacy review tickets in Jira for new processing activities approved in the period"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "P4.2",
        "domain": "Privacy",
        "domainCode": "P",
        "title": "Retention of Personal Information Consistent with Objectives",
        "description": "The entity retains personal information consistent with the entity's objectives related to privacy. Personal information is retained only as long as necessary to fulfill the stated purpose.",
        "guidance": "Retention schedules should define maximum retention periods for each category of personal data, aligned to legal requirements and business need. Automated deletion mechanisms should enforce retention limits without relying on manual processes.",
        "implementationGuide": "Define personal data retention periods in the RoPA and configure automated deletion using AWS S3 Lifecycle Policies, database scheduled purge jobs, or OneTrust's data retention automation to delete personal data at the end of its retention period. Test automated deletion processes quarterly to confirm they execute correctly. Maintain deletion execution logs as audit evidence. The 'done' state is automated deletion configured for all personal data stores, deletion logs retained, and quarterly tests confirming correct operation. A common failure mode is setting retention periods in policy but never implementing technical enforcement, resulting in personal data retained indefinitely in production databases.",
        "exampleEvidence": [
            "Personal data retention schedule by data category aligned to legal requirements",
            "AWS S3 Lifecycle Policy or database purge job configuration for personal data",
            "Automated deletion execution logs for the audit period",
            "Quarterly deletion mechanism test results confirming correct operation",
            "RoPA showing retention period field populated for each processing activity",
            "DPO or legal review of retention schedule against applicable regulations"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "P4.3",
        "domain": "Privacy",
        "domainCode": "P",
        "title": "Disposal of Personal Information",
        "description": "The entity disposes of personal information consistent with the entity's objectives related to privacy. Disposal methods prevent unauthorized access to personal information.",
        "guidance": "Personal data disposal must use methods that render the data unrecoverable, appropriate to the medium (e.g., cryptographic erasure for encrypted data, secure overwriting for physical media). Disposal must be documented.",
        "implementationGuide": "Implement cryptographic erasure for personal data stored in encrypted AWS S3 buckets or Azure Blob Storage by deleting the encryption key, which renders the data unrecoverable without a manual wipe of every object. For physical devices, use Blancco or equivalent certified erasure software and retain certificates. Manage disposal requests and records in OneTrust or a dedicated DSAR management tool. The 'done' state is documented disposal records for all personal data disposal events, certificates of destruction for physical media, and cryptographic key deletion logs for cloud storage. A common failure mode is deleting database records but retaining backup copies that contain the same personal data, resulting in incomplete disposal.",
        "exampleEvidence": [
            "Personal data disposal policy defining approved methods by media type",
            "Cryptographic key deletion logs for cloud-stored personal data",
            "Certificate of destruction for physical media containing personal information",
            "Backup deletion procedure for personal data included in backup sets",
            "Disposal execution records linked to data subject deletion requests",
            "Annual audit confirming disposal procedures are followed"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "P5.1",
        "domain": "Privacy",
        "domainCode": "P",
        "title": "Access: Provides Access to Personal Information for Review",
        "description": "The entity provides data subjects with access to their personal information for review consistent with the entity's objectives related to privacy.",
        "guidance": "A process for handling data subject access requests (DSARs) should be in place, with responses provided within legally required timeframes. Identity verification should be performed before releasing personal data to prevent unauthorized disclosure.",
        "implementationGuide": "Deploy a DSAR management workflow in OneTrust DSAR or a Jira Service Management portal, providing data subjects with a self-service intake form and automated acknowledgement. Configure the workflow with a 30-day response SLA (extendable to 60 days for complex requests) and track all open DSARs against the SLA. Integrate with production databases to enable automated data retrieval where possible, reducing manual effort. The 'done' state is a DSAR intake process with SLA tracking, identity verification step before data release, and 100% of DSARs responded to within the legal timeframe. A common failure mode is handling DSARs via an unmonitored email inbox with no tracking, resulting in missed deadlines and regulatory complaints.",
        "exampleEvidence": [
            "DSAR intake portal or form with acknowledgement automation",
            "DSAR log showing all requests received, response dates, and SLA compliance",
            "Identity verification procedure and evidence of application to sample requests",
            "Sample completed DSAR response (redacted)",
            "DSAR response SLA policy aligned to applicable regulations",
            "Staff training records for DSAR handling procedures"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "P5.2",
        "domain": "Privacy",
        "domainCode": "P",
        "title": "Corrects Inaccurate Personal Information",
        "description": "The entity corrects identified inaccurate personal information in a timely manner consistent with the entity's objectives related to privacy.",
        "guidance": "Data subjects should have a clear mechanism to request correction of inaccurate personal information. Corrections should be propagated to all relevant systems and communicated to recipients who received the inaccurate data where feasible.",
        "implementationGuide": "Extend the DSAR workflow in OneTrust or Jira Service Management to include correction requests, with a defined SLA for making corrections (e.g., 15 business days). Implement correction workflows that update the record in all affected production systems, not just the primary database. Maintain a log of all correction requests and outcomes, including downstream notifications where required. The 'done' state is a documented correction request process, a correction log with SLA compliance metrics, and evidence that corrections are propagated to all affected systems. A common failure mode is correcting data in the primary application database but failing to update copies in analytics data warehouses, data lakes, or backup systems.",
        "exampleEvidence": [
            "Correction request intake process documentation and SLA definition",
            "Correction request log with request date, correction made, and completion date",
            "System propagation checklist ensuring correction applied across all affected data stores",
            "Sample completed correction record (redacted)",
            "Downstream notification procedure for corrections sent to third parties",
            "Staff training on correction request handling"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "P6.1",
        "domain": "Privacy",
        "domainCode": "P",
        "title": "Disclosure to Third Parties: Discloses Personal Information Only to Third Parties with Legitimate Purpose",
        "description": "The entity discloses personal information to third parties only for the purposes identified in the notice and with the implicit or explicit consent of the data subject, consistent with the entity's privacy objectives.",
        "guidance": "Third-party disclosure should be governed by data processing agreements (DPAs) or data sharing agreements that specify permitted uses, security requirements, and the data subject's rights. Disclosures should be documented and limited to the minimum necessary data.",
        "implementationGuide": "Maintain a third-party disclosure register in OneTrust Third-Party Risk Management, documenting each disclosure relationship, legal basis, data elements shared, and DPA status. Route all new third-party sharing arrangements through a privacy review in Jira, requiring legal review and DPA execution before data sharing begins. Review the third-party disclosure register quarterly to confirm all active relationships have current DPAs. The 'done' state is a complete disclosure register, DPAs executed with all data processors, and quarterly review records confirming register currency. A common failure mode is allowing developers to integrate new third-party APIs that receive personal data without triggering a privacy review, creating undocumented disclosure relationships.",
        "exampleEvidence": [
            "Third-party disclosure register with legal basis, data elements, and DPA status",
            "Executed DPAs or data sharing agreements with all third-party recipients",
            "Privacy review ticket for a sample of new third-party integrations",
            "Quarterly disclosure register review records",
            "Sub-processor list published to data subjects with change notification procedure",
            "Legal review confirming disclosures align with consent and regulatory requirements"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "P6.2",
        "domain": "Privacy",
        "domainCode": "P",
        "title": "Creates and Retains Complete, Accurate, Timely Disclosure Records",
        "description": "The entity creates and retains a complete, accurate, and timely record of authorized disclosures of personal information consistent with the entity's privacy objectives.",
        "guidance": "Disclosure records should capture the recipient, data elements shared, date, purpose, and legal basis. Records should be retained for a period sufficient to respond to regulatory inquiries.",
        "implementationGuide": "Configure data transfer logging in AWS CloudTrail or Azure Monitor to capture API calls that result in personal data transfers to third-party endpoints. Supplement automated logs with the third-party disclosure register maintained in OneTrust, ensuring each disclosure event is recorded with recipient, date, purpose, and data elements. Retain disclosure records for at least five years to support regulatory inquiry responses. The 'done' state is automated logging of data transfers plus a disclosure register with complete manual records, both retained for the required period. A common failure mode is relying solely on application-level logging that does not capture the nature of the data transferred, making it impossible to reconstruct what personal data was shared with whom.",
        "exampleEvidence": [
            "Third-party disclosure register with complete fields for all disclosure events",
            "API transfer logs from CloudTrail or Azure Monitor showing data egress events",
            "Log retention configuration confirming five-year retention for disclosure records",
            "Sample disclosure record showing recipient, data elements, date, and purpose",
            "Quarterly disclosure record completeness audit",
            "Legal hold procedure for disclosure records subject to litigation or regulatory investigation"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "P6.3",
        "domain": "Privacy",
        "domainCode": "P",
        "title": "Discloses Personal Information to Third Parties Based on Contracts",
        "description": "The entity discloses personal information to third parties based on contracts that include privacy-relevant requirements consistent with the entity's privacy objectives.",
        "guidance": "Data processing agreements should define the processor's permitted uses, security obligations, sub-processor approval requirements, breach notification obligations, and data subject rights assistance obligations.",
        "implementationGuide": "Develop a standard DPA template reviewed by legal counsel that meets GDPR Article 28 requirements, and manage DPA execution through DocuSign integrated with the vendor management workflow in ServiceNow or Jira. Use OneTrust to track DPA execution status for each vendor and alert on DPAs approaching their review or renewal date. Require annual re-attestation from critical data processors that their security controls remain sufficient. The 'done' state is a signed DPA on file with 100% of data processors, each DPA reviewed within the past two years, and standard DPA terms covering all Article 28 requirements. A common failure mode is using the vendor's own DPA template without legal review, accepting terms that shift liability or omit required data subject rights assistance provisions.",
        "exampleEvidence": [
            "Standard DPA template with legal counsel approval",
            "DPA execution tracker showing status for all data processors",
            "Sample executed DPA (redacted) covering GDPR Article 28 requirements",
            "Annual DPA review completion log",
            "Vendor security re-attestation records for critical processors",
            "DPA clause mapping to GDPR Article 28 requirements"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "P6.4",
        "domain": "Privacy",
        "domainCode": "P",
        "title": "Informs Third Parties of Complaints and Inquiries",
        "description": "The entity informs third parties and data subjects about complaints, inquiries, and disputes regarding personal information consistent with the entity's privacy objectives.",
        "guidance": "When a privacy complaint involves a third party that processes data on the entity's behalf, the entity should notify the third party and coordinate resolution. Third parties should have a process for receiving and responding to such notifications.",
        "implementationGuide": "Define a third-party complaint notification procedure in the vendor management policy, specifying that OneTrust DSAR tickets involving third-party processors trigger a notification to the relevant processor within 48 hours. Maintain a log of all third-party notifications made in response to privacy complaints in OneTrust Privacy Management. Include complaint notification obligations in all DPAs. The 'done' state is a documented notification procedure, DPAs containing notification clauses, and a log of all third-party notifications in the audit period. A common failure mode is resolving DSAR complaints without notifying the third-party processor whose systems were involved, leaving the processor unaware that their data practices were scrutinized.",
        "exampleEvidence": [
            "Third-party complaint notification procedure in vendor management policy",
            "DPA clause requiring third-party notification of complaints and DSARs",
            "Complaint and inquiry log showing third-party notifications made",
            "Sample third-party notification communication (redacted)",
            "Response tracking for third-party notifications with resolution records",
            "Annual review of complaint notification procedure effectiveness"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "P6.5",
        "domain": "Privacy",
        "domainCode": "P",
        "title": "Obtains Acknowledgment from Third Parties of Their Privacy Responsibilities",
        "description": "The entity obtains acknowledgment from third parties that they accept responsibility for personal information they receive and that they will protect it consistent with the entity's privacy objectives.",
        "guidance": "Third parties should formally acknowledge their privacy and security obligations through signed contracts. Acknowledgements should be renewed when contracts are updated or when the third party's security posture changes significantly.",
        "implementationGuide": "Include an explicit acknowledgement clause in all DPAs and vendor security addenda, executed through DocuSign with records stored in the vendor management platform (OneTrust or Vanta). Send annual re-attestation requests to critical vendors using OneTrust Third-Party Risk Management's questionnaire module, requiring them to confirm their privacy controls remain in place. Track attestation completion and escalate to vendor management when overdue. The 'done' state is a signed acknowledgement on file with 100% of data processors, annual re-attestation completed for critical vendors, and escalation records for any non-responsive vendors. A common failure mode is relying on the vendor's Terms of Service as acknowledgement, which typically lacks the specificity required to demonstrate vendor accountability.",
        "exampleEvidence": [
            "DPA and security addendum with explicit acknowledgement clause, signed by vendor",
            "Annual re-attestation questionnaire sent to critical vendors with completion records",
            "Vendor re-attestation completion tracker",
            "Escalation records for vendors with overdue re-attestations",
            "Vendor management policy requiring signed acknowledgements before data sharing",
            "DocuSign or equivalent execution records for DPAs"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "P6.6",
        "domain": "Privacy",
        "domainCode": "P",
        "title": "Notifies Data Subjects and Others of Privacy Breaches and Incidents",
        "description": "The entity provides notification of privacy breaches and security incidents to affected data subjects, regulators, and others as required by law or contract, consistent with the entity's privacy objectives.",
        "guidance": "Breach notification procedures should define the assessment process for determining notifiability, the notification timeline (e.g., 72 hours for GDPR), required notification content, and the communication channel for each audience.",
        "implementationGuide": "Maintain a breach notification playbook in Confluence that maps breach types to notification obligations by jurisdiction, integrating with OneTrust Incident Management for breach assessment and notification tracking. Configure automated notification drafts for common breach scenarios to accelerate the response. Engage outside counsel for complex breach assessments and retain their engagement records. Conduct annual breach notification tabletop exercises to validate readiness. The 'done' state is a tested breach notification playbook, a documented 72-hour GDPR notification process, and notification records for any breach events in the audit period. A common failure mode is confusing a security incident with a notifiable breach and either over-notifying (unnecessary cost) or under-notifying (regulatory risk) due to inadequate assessment criteria.",
        "exampleEvidence": [
            "Breach notification playbook with jurisdiction-specific timelines and templates",
            "OneTrust Incident Management breach assessment workflow configuration",
            "Breach notification tabletop exercise report",
            "Regulatory notification records for any breach events (or attestation of no notifiable breaches)",
            "Customer breach notification records or templates",
            "Outside counsel engagement log for breach legal advice"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "P6.7",
        "domain": "Privacy",
        "domainCode": "P",
        "title": "Addresses Incomplete or Inaccurate Disclosures",
        "description": "The entity addresses incomplete or inaccurate disclosures of personal information in a timely manner, consistent with the entity's privacy objectives.",
        "guidance": "When a disclosure of personal information is found to be incomplete or inaccurate, a process should be in place to assess the impact, correct the disclosure, and notify affected parties. Root cause analysis should prevent recurrence.",
        "implementationGuide": "Implement a disclosure quality review process where the privacy team reviews a sample of disclosures quarterly, using the disclosure register in OneTrust to identify and investigate anomalies. When an incomplete or inaccurate disclosure is identified, log it as a privacy incident in OneTrust Incident Management, assess impact, send corrective notification to the recipient, and complete a root cause analysis within 30 days. Track corrective actions in Jira with defined due dates. The 'done' state is a quarterly disclosure quality review process, a documented response procedure for inaccurate disclosures, and root cause analysis completed for all identified incidents. A common failure mode is identifying inaccurate disclosures but failing to notify the recipient, leaving them operating on incorrect information.",
        "exampleEvidence": [
            "Quarterly disclosure quality review records with findings",
            "Disclosure incident log with assessment, corrective notification, and RCA",
            "Corrective notification templates for recipients of inaccurate disclosures",
            "Root cause analysis records for identified disclosure quality incidents",
            "Disclosure quality improvement actions tracked in Jira",
            "Privacy team review procedure for disclosure accuracy"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "P7.1",
        "domain": "Privacy",
        "domainCode": "P",
        "title": "Quality of Personal Information: Maintains Accurate, Complete, Relevant Personal Information",
        "description": "The entity collects and maintains personal information that is accurate, complete, and relevant for the purposes for which it is to be used, consistent with the entity's privacy objectives.",
        "guidance": "Data quality controls should validate personal information at collection, flag anomalies, and provide mechanisms for data subjects to correct inaccurate information. Periodic data quality reviews should identify and remediate stale or inaccurate records.",
        "implementationGuide": "Implement input validation at all personal data collection points (web forms, APIs) using schema validation in AWS API Gateway or application-layer validation libraries to enforce format and completeness requirements. Configure data quality monitoring in Datadog or a data observability platform to detect anomalous values, missing fields, or format deviations in personal data records. Conduct annual data quality audits sampling records from each major personal data store, tracked in OneTrust or a dedicated DQ management tool. The 'done' state is input validation on all collection points, automated data quality monitoring active, and annual data quality audit completed with findings addressed. A common failure mode is validating data at collection but allowing quality to degrade over time through unchecked updates or migration errors.",
        "exampleEvidence": [
            "Input validation configuration for personal data collection forms and APIs",
            "Data quality monitoring dashboard showing anomaly detection coverage",
            "Annual data quality audit report with findings and remediation",
            "Data subject correction request log showing quality improvements from user feedback",
            "Data quality policy defining accuracy, completeness, and relevance standards",
            "Sample data quality alert and investigation record"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
    {
        "id": "P8.1",
        "domain": "Privacy",
        "domainCode": "P",
        "title": "Addresses Complaints and Inquiries Regarding Privacy",
        "description": "The entity addresses privacy-related complaints and inquiries in a timely manner consistent with its privacy objectives, including providing individuals with information about their rights and options for seeking resolution.",
        "guidance": "A privacy complaint process should provide data subjects with a clear channel to raise concerns, with responses provided within defined timeframes. Complaints should be tracked, investigated, and used to improve privacy practices.",
        "implementationGuide": "Deploy a privacy complaint intake form linked to OneTrust DSAR and Incident Management, with automated acknowledgement sent to the complainant within 24 hours. Define complaint response SLAs (e.g., 30 days for GDPR requests, 45 days for CCPA) and track compliance in the OneTrust dashboard. Escalate unresolved complaints to the DPO and legal counsel and document the escalation and resolution. Conduct quarterly complaint trend analysis to identify systemic privacy issues feeding into the risk assessment. The 'done' state is a documented complaint process with SLA tracking, 100% of complaints acknowledged within 24 hours, and quarterly trend analysis presented to the privacy steering committee. A common failure mode is receiving complaints through multiple channels (email, social media, web form) with no central tracking, resulting in missed responses and duplicate handling.",
        "exampleEvidence": [
            "Privacy complaint intake form and automated acknowledgement configuration",
            "Complaint log with received date, response date, and SLA compliance metric",
            "Sample complaint investigation and resolution record (redacted)",
            "DPO escalation records for complex or unresolved complaints",
            "Quarterly complaint trend analysis report",
            "Privacy complaint handling procedure with SLA definitions"
        ],
        "status": "not-started",
        "notes": "",
        "evidence": "",
        "owner": ""
    },
]

output_path = "/Users/mac/Desktop/grc-dashboard/src/data/soc2.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(controls, f, indent=2, ensure_ascii=False)

print(f"Written {len(controls)} controls to soc2.json")
