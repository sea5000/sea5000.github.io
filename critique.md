# Critique — spencer-anderson.com Portfolio

*Prepared for Spencer E. Anderson*
*Scope: index.html, about.html, projects.html, three case studies (Geography-Quiz, DataDine, TreeEquity), main.js, styles.css, and the live hosting configuration.*

---

## 1. Brutal Assessment

Your portfolio does not sell Spencer E. Anderson. It sells a capable undergraduate who once worked in intelligence.

The single most disqualifying sentence on your site is in the footer — the one element repeated on every single page:

> *"Building toward a portfolio of analytic and programming work."*

You briefed 120+ senior leaders. You led a three-person indications-and-warning cell. You won a Joint Service Achievement Medal. And in the persistent brand statement of your own site, you describe yourself as someone still *building toward* a portfolio. You have done the opposite of controlling your narrative — you handed the narrative to the most self-deprecating version of yourself and told it to write.

This is not modesty. It is the difference between positioning and apologizing, and it is costing you credibility with every person who hits the site.

### The three structural failures

**1. The identity is incoherent across the funnel.**
Your homepage badge reads *"Intelligence Analyst & Data Science Student."* The About page opens with *"Award-winning Intelligence Analyst"* and 6+ years of military service. The projects page — the thing you're actually trying to sell — is a collection of coursework: *"Complete — course submission,"* *"Built as my FCSP course final project,"* *"built to gather data for a statistics class."*

The visitor reads: senior military intelligence professional... who is showing me homework. You have front-loaded the achievement of the analyst and then demonstrated the output of the student, and the two never reconcile. Either the analyst identity is the product (then the projects page must show analyst-grade work), or the analyst identity is the framing device (then it must not be the loudest thing on every page). Right now it is both, and it persuades as neither.

**2. The homepage "Projects" section is empty.**
This is not hyperbole. Look at `index.html` lines 90–96. There is a heading, one muted sentence telling the user to click elsewhere, and a button. No previews. No thumbnails. No single concrete example of the thing you say you do — *"turn complex data into clear, actionable insight"* — exists on the page that a stranger will judge first.

The projects page is one click away, but a homepage that shows nothing is a homepage that asked to be closed. The person who briefed 120+ leaders should know that you do not ask your audience to take your word for the payoff and chase it. You show the payoff on the first screen.

**3. The stats are backward-facing and unverifiable.**
"150+ daily briefs authored," "10 analysts led," "120+ senior leaders briefed," "6+ years." These are the numbers of a resume that counts inputs. A portfolio that sells *outcomes* shows the result: the decision that changed because of your brief, the model that outperformed, the tool that saved a team 40 hours a week. Inputs can be inflated and are treated as such; outcomes are memorized. You have none of the latter on the homepage.

### The project roster is misweighted

Seven projects. Only three have case studies. The three with case studies are all coursework. The two most differentiated, possibly impressive projects — **BeyondTheGrave** (a voice-cloning afterlife product) and **BookMe** — get a card and a GitHub link, no case study, no screenshots, no reasoning about the problem, no decisions made.

Your best, most unique thinking is the least documented. Your most generic, assignment-shaped work is the most documented. That is exactly inverted from what a portfolio must be.

Further: the projects page open with a *"Startup"* card — a voice-cloning-afterlife product — as if a visitor's first impression of your engineering should be an untested startup concept. Nothing on that card is a demonstration of craft, and it announces a speculative project before you show a single shipped, working thing.

### Dead weight and self-sabotage

- The closing card on projects.html — *"More on GitHub"* — is filler. It adds nothing to the decision a visitor is making and reads as a placeholder for content you haven't written.
- The Skills list mixes rigorous, verifiable skills (data fusion, network/link analysis, briefing) with unprovable, hand-waved entries ("Docker & self-hosted stacks," "Database Management," "Linux System Administration") that appear nowhere else on the site as demonstrated output. Every unsubstantiated claim gives a skeptic a target.
- The reference quote is anonymous, generic, and could describe anyone competent. A recommendation with no name, no title, no organization is a decoration, not evidence.
- There is no downloadable resume, no case for a specific role, no "hire me" surface, no call to action with any consequence. The site opens a conversation and then refuses to take a next step.

---

## 2. Strategic Diagnosis

### Root cause: you are presenting two different careers and letting the audience reconcile them

The tension is not cosmetic. It is the symptom of an unresolved strategic question: **what is the product?**

If the product is you-the-data-scientist, then the military analyst identity is context, not the headline — and the analyst content (which is sensitive, redacted, and unshowable) can only ever be asserted, never demonstrated. Your public evidence pool is entirely student work, and that is the ceiling of what you can prove.

If the product is you-the-analyst, then the projects page must be rebuilt around analytic artifacts — data products, intelligence-style products, network-graph work, briefing decks you can declassify — and a single course-final DataDine cannot be the centerpiece.

You have tried to be both and, in doing so, become neither. A portfolio that cannot answer "what will this person do for me next, and why should I believe they'll do it well?" will not close a single recruiter or client. Yes, the deployment arguments: you're early in a pivot, evidence is scarce, coursework is all you have *right now*. That is precisely why compartmentalizing matters: credibility gap forces the data-scientist path, and the data-scientist path must be executed with more discipline than a student's.

### You are mistaking activity for progress

Every commit, every cleaned-up repo, every stripped comment was necessary — and none of it is a differentiator. NotFound, refactoring, and repo hygiene are table stakes. You have spent your energy on the *container* (site structure, naming, deployments, READMEs) while the *content* (the demonstration of capability) remains thin, and you appear to count the container work as substantive. It is not. Nobody was ever hired because a portfolio was tidy; people are hired because a portfolio demonstrates that the owner can do the job.

### You are optimizing the wrong metric

Your recent energy went into: renaming GEO-QUIZ → Geography-Quiz, adding a live-quiz button, splitting repos, setting up GitHub Pages and Firebase hosting. All fine. None of it addresses the only metric that matters: **does a stranger leave the first page with a concrete, repeated, believable image of what you can build?**

### The deployment gap is your roof and your floor

Two subdomains, one on a brand-new GitHub Pages user repo that keeps colliding with an unrelated repo's history, and one on Firebase behind a CNAME that doesn't attach the domain to the Hosting project until you configure it in the console. The quiz "doesn't load" because the domain was never connected at the Firebase level — DNS was never the problem. This is the same pattern everywhere: you are solving the plumbing and calling it progress while the actual product — a site that sells you — is unfinished. A broken-live-quiz experience is a small but real credibility leak that a determined visitor will find in under a minute.

---

## 3. Decisive Direction

Proceed in this order. Do not reorder it.

### Step 1 — Decide the product. Today. In writing.
Write one sentence: *"This portfolio proves I can [verb] for [who], as evidenced by [artifact]."* Commit to the data-scientist/analytics-engineer lane for the public surface. The military history becomes proof of *judgment under pressure and communication to executives*, not the product. Everything below assumes that decision.

### Step 2 — Rebuild the homepage around proof, within the week.
- **Replace the empty Projects section** with three real product cards — actual screenshot / metric / one-line outcome. Not cards that link elsewhere; cards that *demonstrate*.
- **Rewrite the footer brand line.** Remove *"Building toward a portfolio."* Replace with a positioned, forward claim tied to the decision in Step 1.
- **Add a hard call to action** with a consequence: a role-specific line ("Senior analyst — or — data engineer") and an email/contact that prompts action. Right now the site dies at "About Me."

### Step 3 — Rebalance the project roster by seniority, within two weeks.
- **Demote or remove the "Startup" card from the opening position.** Your first impression of engineering should be a shipped, working artifact.
- **Write case studies for BeyondTheGrave and BookMe** — the differentiated work. Structure them as problem → decision → build → result, with the reasoning made explicit. Two screenshots and a paragraph of craft beats a paragraph of self-description.
- **Cut the "More on GitHub" filler card.**
- **Move the unverifiable skills** (Docker, DB management, Linux admin) behind evidence: either add a project that shows them, or delete them. Every claim must be provable from a publicly visible artifact within two clicks.

### Step 4 — Convert inputs to outcomes, everywhere.
Replace input-statistics with outcome-statistics. "150 briefs" becomes "brief that changed the commander's decision for operation X." "10 analysts led" becomes "team delivery that [outcome]." If an outcome is unverifiable or sensitive, drop the number and keep the judgment it implies. A trimmed, credible set beats an inflated, deniable one.

### Step 5 — Verify the live deployment end-to-end, today.
- Fix the quiz domain in the **Firebase console** by attaching `quiz.spencer-anderson.com` as a custom domain to the Hosting site (your CNAME is already correct — the missing step is console configuration). Confirm 200, TLSTLS, and the happy path in a browser, not curl.
- Reconcile the `sea5000.github.io` repo so a visitor clicking shared links never hits the old migrated-history redirect. Confirm Pages serves only the intended content.

### Step 6 — Add basic credibility infrastructure (one sitting).
A downloadable resume PDF, an `og:`/social preview, and a contact surface. Small, cheap, and currently absent.

---

## 4. Elevated Perspective

**You are not blocked by effort, intelligence, or a lack of material. You are blocked by a refusal to choose and commit to a single identity on a public surface.**

The pattern across every decision in this project — renaming repos, splitting hosts, worrying about which comments were stripped, polishing CNAMEs — is a relentless and familiar mechanism: **activity as an anesthetic for the discomfort of committing to a persona and being judged on it.** The deepest work available to you now is not technical. It is the decision to say, *"This is who I am professionally, this is the work that proves it, and I accept that a stranger will judge me against it."* Until you make that choice, no amount of repo hygiene or renaming will make the site sell.

The uncomfortable truth, delivered plainly: today the site mostly proves you are diligent and indecisive. You have the raw material — the discipline, the analyst's judgment, the demonstrated ability to ingest a problem, and the writing skill to explain it — to turn that around. What you lack is not capability. It is the willingness to stake a single, bold, falsifiable claim about yourself and let the whole site serve it.

Stake the claim. Then the plumbing will look like progress, because it will be in service of a product that persuades.

---

*Written without pleasantries, as requested. The next version of this document should not be necessary.*
