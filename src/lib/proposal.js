/** Markdown template used when an org has no saved draft. */
export const GSOC_TEMPLATE = `# GSoC 2026 Proposal: [Project Title]
**Organization:** [Organization Name]
**Applicant:** [Your Name]

## 1. Contact Information
* **Email:** [your.email@example.com]
* **GitHub:** [https://github.com/your-username]
* **Timezone:** [Your Timezone]

## 2. Abstract
[Provide a short summary of what you intend to do, why it is useful, and the expected outcome.]

## 3. Architecture and Implementation
[Detail your technical approach, libraries, design patterns, and any API changes you plan to make.]

## 4. Timeline
* **Community Bonding:** [Pre-coding activities]
* **Week 1-2:** [Tasks]
* **Week 3-4:** [Tasks]
* **Midterm Evaluation:** [Deliverables at this stage]
* **Week 5-6:** [Tasks]
* **Week 7-8:** [Tasks]
* **Final Evaluation:** [Final deliverables and documentation]

## 5. Deliverables
[List what will be completed and merged by the end of the program.]

## 6. About Me
[Your background, relevant skills, and past contributions to open source.]
`;

export const PROPOSAL_AUTOSAVE_KEY = 'gaf_proposal_autosave';

const inMemoryDrafts = {};
let localStorageAvailable = true;

export const proposalStorageKey = (orgName) => 'gaf_proposal_' + orgName;

export function getTemplateForOrg(orgName) {
  return GSOC_TEMPLATE.replaceAll('[Organization Name]', orgName);
}

export function isAutosaveEnabled() {
  if (!localStorageAvailable) return false;
  try {
    return localStorage.getItem(PROPOSAL_AUTOSAVE_KEY) === 'true';
  } catch {
    localStorageAvailable = false;
    return false;
  }
}

export function setAutosaveEnabled(enabled) {
  if (!localStorageAvailable) return;
  try {
    localStorage.setItem(PROPOSAL_AUTOSAVE_KEY, enabled ? 'true' : 'false');
  } catch {
    localStorageAvailable = false;
  }
}

export function getDraft(orgName) {
  if (Object.hasOwn(inMemoryDrafts, orgName)) return inMemoryDrafts[orgName];
  if (!localStorageAvailable) return null;
  try {
    const stored = localStorage.getItem(proposalStorageKey(orgName));
    if (stored !== null) {
      inMemoryDrafts[orgName] = stored;
      return stored;
    }
  } catch {
    localStorageAvailable = false;
  }
  return null;
}

export function saveDraft(orgName, content) {
  inMemoryDrafts[orgName] = content;
  if (!localStorageAvailable) return;
  try {
    localStorage.setItem(proposalStorageKey(orgName), content);
  } catch {
    localStorageAvailable = false;
  }
}

export function clearDraft(orgName) {
  delete inMemoryDrafts[orgName];
  if (!localStorageAvailable) return;
  try {
    localStorage.removeItem(proposalStorageKey(orgName));
  } catch {
    localStorageAvailable = false;
  }
}

export function proposalFilename(orgName, ext) {
  return 'GSoC_Proposal_' + orgName.replace(/\s+/g, '_') + '.' + ext;
}
