# Remote developer access — planning only

Date: 10 October 2026
User selected: SSH/SFTP or VS Code Remote SSH, not a browser terminal or embedded application shell.
Status: No access configured, services installed, accounts created, credentials collected or application implemented. Host/domain not purchased. No spending now.

## Purpose

Allow the authorized maintainer to inspect releases, retrieve diagnostic information and perform controlled maintenance from their computer. View the site through the normal/staging HTTPS URL. Use SSH/SFTP for deployment/diagnostics; use VS Code Remote SSH primarily with a development/staging workspace where supported. Source edits normally follow Git review, tests and a controlled release, not direct production modification.

## Hosting requirements

Verify SSH entitlement, permitted shell/tools, SFTP, account isolation, SSH key support and restrictions. SFTP availability does not prove an interactive SSH shell or VS Code Remote SSH compatibility. VS Code's remote server needs supported OS/runtime, storage and permission to run its process; shared hosting may restrict it. Confirm plan capability rather than choosing a VPS only for editor convenience.

## Access model

Firm-owned hosting account with explicit delegated maintainer authorization. Separate named non-root account, narrowly scoped to the application's release/storage needs; no broad administrator access by default. If elevated maintenance is needed, grant only documented privileges. Do not install an owner backdoor, arbitrary-command Laravel endpoint or hidden always-active account.

Use individual SSH keys; keep private keys on the maintainer device or secure credential store, never in repository/chat/docs. Verify server host keys through a trusted channel. Password-based fallback requires separate review; no credentials requested in chat.

Prefer restricted network access/VPN or appropriate IP controls where practical, without making unverified fixed-IP assumptions. Disable unused authentication methods only after testing alternative access and recovery. Avoid leaving unnecessary management services exposed.

## Release and safety workflow

Inspect changes in an isolated workspace; commit/review/test; deploy to staging; verify; obtain production authorization; deploy a tested release using a least-privilege process. Keep an independent backup and rollback route. Record any exceptional production hotfix and reconcile it back to source immediately. Do not edit secrets or case data through public web tools.

Keep production logs redacted, restrict database permissions and avoid downloading confidential data unnecessarily. Independent diagnostics should not grant agents permanent SSH credentials.

## Before configuration

Confirm exact host/account, firm authorization, maintainer identity, allowed paths/actions, environment (staging versus production), access duration, key enrollment method, operator responsibilities and backup/recovery plan. No commands or connection details are invented here.

## Acceptance and handover

Authorized account can access only intended resources; host identity verified; approved authentication works; audit/diagnostic access is appropriate; staging preview works; recovery and revocation tested. Record who owns access approval, how to revoke keys and what happens when maintenance ends. Firm can revoke maintainer access without losing its source/accounts or ability to operate the website.

This is a separate maintenance plan, not a public-site feature or approval to install/configure anything now.
