<img src="https://cdn.jsdelivr.net/gh/Claytonee/Technical-Support-System@main/assets/tss-banner.svg" alt="Technical Support System — production field-support platform for 36 partner schools" width="100%"/>

# Technical Support System — Production Field-Support Platform

![Node.js](https://img.shields.io/badge/Node.js-LTS-00085B?style=flat-square&logo=nodedotjs&logoColor=17D9F9)
![Express](https://img.shields.io/badge/Express-REST-00085B?style=flat-square&logo=express&logoColor=17D9F9)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-23_tables-00085B?style=flat-square&logo=postgresql&logoColor=17D9F9)
![JWT](https://img.shields.io/badge/Auth-JWT_%C2%B7_4--tier_RBAC-00085B?style=flat-square&logo=jsonwebtokens&logoColor=17D9F9)
![Cloudinary](https://img.shields.io/badge/Media-Cloudinary_CDN-00085B?style=flat-square&logo=cloudinary&logoColor=17D9F9)
![Deploy](https://img.shields.io/badge/Deploy-Render%20%2F%20cPanel-00085B?style=flat-square&logo=render&logoColor=17D9F9)
![SLA](https://img.shields.io/badge/SLA-4--tier_engine-34D399?style=flat-square)

> The single channel through which Opportunity Education Tanzania's **36 partner schools** and its ICT field team report, triage and resolve technical faults.
> **Status:** in production · **Role:** Software Developer (Partnership Network & Development Team) · **2026**

Technical overview — this repository documents the system I designed and shipped at [Opportunity Education Tanzania](https://www.opportunityeducation.org/); the production codebase is proprietary.

## The problem

Before this system, a broken tablet or a school with no connectivity was fixed through phone calls and memory. Faults sat unowned: no record of who reported what, no deadline, no escalation when a technician was overloaded, and leadership had no way to see which schools were quietly failing. Three teams tracked the same reality in separate spreadsheets.

## The system

**112 REST endpoints over a 23-table schema**, built so that the deadline — not a person's memory — is what moves a fault forward.

### Automated SLA engine

<img src="https://cdn.jsdelivr.net/gh/Claytonee/Technical-Support-System@main/assets/sla-engine.svg" alt="Automated SLA engine: four priority tiers with hard deadlines, showing a critical fault breaching its two-hour deadline and escalating" width="100%"/>

Every fault is triaged into one of four priority tiers with hard deadlines and automatic breach detection — no reported fault sits unowned:

| Priority | Resolution deadline |
|---|---|
| Critical | ≤ 2 hours |
| High | ≤ 8 hours |
| Medium | ≤ 24 hours |
| Low | ≤ 72 hours |

### Escalation chain

Breach detection is not a report someone runs. It fires on its own, and it keeps climbing until the fault is owned.

```mermaid
%%{init: { "theme": "base", "themeVariables": { "primaryColor": "#00085B", "primaryTextColor": "#EAF7F3", "primaryBorderColor": "#0E4DFF", "lineColor": "#17D9F9", "secondaryColor": "#0127BC", "tertiaryColor": "#00072D", "clusterBkg": "#00072D", "edgeLabelBackground": "#00072D", "fontSize": "13px" } }}%%
flowchart LR
    T["Teacher<br/>reports fault"] --> SA["School admin<br/>triage"] --> PA["Platform admin<br/>field team"] --> R["Resolved<br/>and verified"]
    SA -. "SLA breach" .-> PA
    PA -. "SLA breach" .-> ESC["Leadership<br/>visibility"]
    classDef ok fill:#00085B,stroke:#0E4DFF,color:#EAF7F3,stroke-width:1.5px;
    classDef done fill:#0127BC,stroke:#34D399,color:#EAF7F3,stroke-width:1.5px;
    classDef esc fill:#00072D,stroke:#F20002,color:#EAF7F3,stroke-width:1.5px;
    class T,SA,PA ok;
    class R done;
    class ESC esc;
```

### Four-tier role-based access control

A 4-tier RBAC model across all 112 endpoints: every role sees **exactly** the schools and records it is permitted to see — and nothing more. School admins manage their own school; field engineers see their assigned region; platform admins see the whole network. Every state change lands in an **audit trail**.

### Tablet-fleet management

Every device tracked by serial number, class assignment and full service history, with CSV import/export for bulk operations — replacing the spreadsheets that could not answer "which tablets has this school, and what has been repaired on each?"

### Weekly school health check-ins

Structured per-school check-ins across **connectivity, tablets, platform and power**, turning ad-hoc status calls into comparable data the team can act on over time.

## Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js, Express |
| Database | PostgreSQL — 23 tables, audit trail on every state change |
| API | 112 REST endpoints, 4-tier RBAC enforced per endpoint |
| Auth | JWT |
| Media | Cloudinary CDN |
| Infra | Render, cPanel |

## Impact

- One channel for 36 schools instead of phone calls and memory.
- Deadlines and breach detection instead of unowned faults.
- A complete audit trail for every fault and device.
- Leadership sees network health without waiting for someone to compile it.

## Reach me

[![Email](https://img.shields.io/badge/Email-claytonecurth%40gmail.com-0E4DFF?style=for-the-badge&labelColor=00072D&logo=gmail&logoColor=17D9F9)](mailto:claytonecurth@gmail.com)

Happy to walk through the SLA engine, the RBAC model or the fleet schema in detail.

<sub>Built during my software developer placement at Opportunity Education Tanzania. The system described here belongs to Opportunity Education Tanzania and its production codebase is not published. The artwork and written content of this page are © 2026 Claytone Curthberth Mhina and are not licensed for reuse without written permission.</sub>

<img src="https://cdn.jsdelivr.net/gh/Claytonee/Technical-Support-System@main/assets/tss-footer.svg" alt="" width="100%"/>
