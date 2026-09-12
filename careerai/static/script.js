const careerForm = document.querySelector("#career-form");
const resumeForm = document.querySelector("#resume-form");
const resumeFile = document.querySelector("#resume-file");
const fileLabel = document.querySelector("#file-label");
const mentorForm = document.querySelector("#mentor-form");
const mentorInput = document.querySelector("#mentor-input");
const mentorConversation = document.querySelector("#mentor-conversation");
const mentorTopic = document.querySelector("#mentor-topic");
const stuckPanel = document.querySelector("#stuck-panel");
const skillSearchForm = document.querySelector("#skill-search-form");
const skillSearchInput = document.querySelector("#skill-search");
const skillSearchResult = document.querySelector("#skill-search-result");
const courseGenerator = document.querySelector("#course-generator");
const courseForm = document.querySelector("#course-form");
const generatedCourse = document.querySelector("#generated-course");
const codeInput = document.querySelector("#code-input");
const codeLanguage = document.querySelector("#code-language");
const codeError = document.querySelector("#code-error");
const codeOutput = document.querySelector("#code-output");
const codeProblem = document.querySelector("#code-problem");
const generateCodeButton = document.querySelector("#generate-code-button");
const runCodeButton = document.querySelector("#run-code-button");
const clearOutputButton = document.querySelector("#clear-output-button");
let mentorMode = "guided";
let hintLevel = 0;
const on = (element, event, handler) => element?.addEventListener(event, handler);

on(clearOutputButton, "click", () => {
  codeOutput.innerHTML = "<div class=\"code-empty-state\"><span>⌘</span><strong>Output cleared</strong><p>Run the code or choose an analysis action.</p></div>";
});

on(runCodeButton, "click", async () => {
  if (!codeInput.value.trim()) { codeOutput.textContent = "Paste code before running it."; return; }
  runCodeButton.disabled = true;
  runCodeButton.textContent = "Running...";
  codeOutput.innerHTML = "<div class=\"code-thinking\">Running in a restricted subprocess<span>● ● ●</span></div>";
  try {
    const response = await fetch("/code/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: codeInput.value, language: codeLanguage.value }) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "Code could not run.");
    const result = body.result;
    codeOutput.innerHTML = `<div class="run-result ${result.ok ? "success" : "failure"}"><strong>${result.ok ? "✓ Execution successful" : "⚠ Execution failed"}</strong><span>${result.error_type || "Python"}</span></div><pre class="run-output"></pre><div class="sandbox-note"></div>`;
    codeOutput.querySelector(".run-output").textContent = result.output;
    codeOutput.querySelector(".sandbox-note").textContent = body.sandbox.note;
  } catch (error) { codeOutput.innerHTML = `<div class="code-empty-state"><strong>Run unavailable</strong><p></p></div>`; codeOutput.querySelector("p").textContent = error.message || "Please try again."; }
  finally { runCodeButton.disabled = false; runCodeButton.textContent = "▶ Run"; }
});

function renderGeneratedCode(solution, execution) {
  codeOutput.innerHTML = `<div class="code-result-status"><strong>Code formation ready</strong><span>${codeLanguage.value}</span></div><pre class="generated-code-block"></pre><div class="code-fix"><strong>How it works</strong><p></p></div><div class="code-complexity"></div><div class="code-next-step"></div><div class="sandbox-note"></div>`;
  codeOutput.querySelector(".generated-code-block").textContent = solution.code || "No code was returned.";
  codeOutput.querySelector(".code-fix p").textContent = solution.explanation || "Review the generated code before using it.";
  const complexity = solution.complexity || {};
  codeOutput.querySelector(".code-complexity").textContent = `Complexity · Time: ${complexity.time || "unknown"} · Space: ${complexity.space || "unknown"}`;
  codeOutput.querySelector(".code-next-step").textContent = `Next step: ${solution.next_step || "Read the explanation and test the idea with your own example."}`;
  codeOutput.querySelector(".sandbox-note").textContent = execution.reason;
}

function renderCodeAnalysis(analysis, execution) {
  codeOutput.innerHTML = `<div class="code-result-status"><strong></strong><span></span></div><p class="code-summary"></p><div class="code-findings"></div><div class="code-complexity"></div><div class="code-tests"><strong>Tests to try</strong><ul></ul></div><div class="code-next-step"></div>`;
  codeOutput.querySelector(".code-result-status strong").textContent = analysis.status || "Reviewed";
  codeOutput.querySelector(".code-result-status span").textContent = analysis.error_type && analysis.error_type !== "none" ? analysis.error_type : "analysis complete";
  codeOutput.querySelector(".code-summary").textContent = analysis.summary || "Review complete.";
  const findings = codeOutput.querySelector(".code-findings");
  (analysis.findings || []).forEach((finding) => { const item = document.createElement("article"); item.className = `code-finding ${finding.severity || "info"}`; item.innerHTML = `<strong></strong><small></small><p></p>`; item.querySelector("strong").textContent = finding.title || "Finding"; item.querySelector("small").textContent = `Line ${finding.line || "unknown"}`; item.querySelector("p").textContent = finding.explanation || ""; findings.appendChild(item); });
  const complexity = analysis.complexity || {};
  codeOutput.querySelector(".code-complexity").textContent = `Complexity · Time: ${complexity.time || "unknown"} · Space: ${complexity.space || "unknown"}`;
  const testList = codeOutput.querySelector(".code-tests ul");
  (analysis.tests_to_try || []).forEach((test) => { const item = document.createElement("li"); item.textContent = test; testList.appendChild(item); });
  codeOutput.querySelector(".code-next-step").textContent = `Next step: ${analysis.next_step || "Try one small change and review the result."}`;
  if (analysis.suggested_fix) { const fix = document.createElement("div"); fix.className = "code-fix"; fix.innerHTML = "<strong>Suggested correction</strong><p></p>"; fix.querySelector("p").textContent = analysis.suggested_fix; codeOutput.insertBefore(fix, codeOutput.querySelector(".code-complexity")); }
  if (!execution.available) { const note = document.createElement("div"); note.className = "sandbox-note"; note.textContent = execution.reason; codeOutput.appendChild(note); }
}

document.querySelectorAll("[data-code-action]").forEach((button) => {
  button.addEventListener("click", async () => {
    if (!codeInput.value.trim()) { codeOutput.textContent = "Paste code before asking the Coding Agent."; return; }
    document.querySelectorAll("[data-code-action]").forEach((item) => { item.disabled = true; });
    codeOutput.innerHTML = "<div class=\"code-thinking\">Career AI is reviewing<span>● ● ●</span></div>";
    try {
      const response = await fetch("/code/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: codeInput.value, language: codeLanguage.value, error: codeError.value, action: button.dataset.codeAction }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "The Coding Agent is unavailable.");
      renderCodeAnalysis(body.analysis, body.execution);
    } catch (error) { codeOutput.textContent = error.message || "The Coding Agent is unavailable."; }
    finally { document.querySelectorAll("[data-code-action]").forEach((item) => { item.disabled = false; }); }
  });
});

on(generateCodeButton, "click", async () => {
  if (!codeProblem.value.trim()) { codeOutput.textContent = "Describe the program you want to form first."; return; }
  generateCodeButton.disabled = true;
  generateCodeButton.textContent = "Forming code...";
  codeOutput.innerHTML = "<div class=\"code-thinking\">Career AI is forming a solution<span>● ● ●</span></div>";
  try {
    const response = await fetch("/code/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ problem: codeProblem.value, language: codeLanguage.value, level: "Beginner" }) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "Code formation is unavailable right now.");
    codeInput.value = body.solution.code || "";
    renderGeneratedCode(body.solution, body.execution);
  } catch (error) { codeOutput.innerHTML = `<div class="code-empty-state"><strong>Code formation unavailable</strong><p></p><button class="button button-secondary" type="button" id="retry-code-generation">Try again</button></div>`; codeOutput.querySelector("p").textContent = error.message || "Please try again."; codeOutput.querySelector("button").addEventListener("click", () => generateCodeButton.click()); }
  finally { generateCodeButton.disabled = false; generateCodeButton.innerHTML = "Form code <span>→</span>"; }
});

function renderCourse(course, cached) {
  generatedCourse.hidden = false;
  generatedCourse.innerHTML = `<div class="course-result-head"><div><p class="mini-label">${cached ? "Saved course" : "New learning path"}</p><h3></h3><p class="course-summary"></p></div><span class="course-version">v${course.course_version || 1}</span></div><div class="course-module-grid"></div><div class="course-footer"><strong>Capstone:</strong> <span class="course-capstone"></span></div>`;
  generatedCourse.querySelector("h3").textContent = course.title || `${course.skill} learning path`;
  generatedCourse.querySelector(".course-summary").textContent = course.summary || "A personalized path built around your goal.";
  generatedCourse.querySelector(".course-capstone").textContent = course.capstone_project || "Build a practical project.";
  const moduleGrid = generatedCourse.querySelector(".course-module-grid");
  (course.modules || []).forEach((module, index) => {
    const card = document.createElement("article");
    card.className = "course-module";
    card.innerHTML = `<span>0${index + 1}</span><h4></h4><p></p><small></small>`;
    card.querySelector("h4").textContent = module.title || "Learning module";
    card.querySelector("p").textContent = module.objective || "Build confidence through practice.";
    card.querySelector("small").textContent = `${(module.lessons || []).length} interactive lessons`;
    moduleGrid.appendChild(card);
  });
  generatedCourse.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function searchSkills(query) {
  skillSearchInput.value = query;
  skillSearchResult.hidden = false;
  skillSearchResult.textContent = "Searching your learning library...";
  courseGenerator.hidden = true;
  generatedCourse.hidden = true;
  try {
    const response = await fetch(`/skills/search?q=${encodeURIComponent(query)}`);
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "Skill search failed.");
    if (body.matches.length) {
      skillSearchResult.innerHTML = `<strong>Found in your library</strong><div class="skill-result-list"></div>`;
      const list = skillSearchResult.querySelector(".skill-result-list");
      body.matches.forEach((skill) => { const item = document.createElement("div"); item.className = "skill-result-item"; item.innerHTML = `<span>✦</span><div><strong></strong><small></small></div>`; item.querySelector("strong").textContent = skill.name; item.querySelector("small").textContent = skill.description || "Personalized learning path"; list.appendChild(item); });
    } else {
      skillSearchResult.innerHTML = `<strong>No saved path yet for “${query}”.</strong><span>Generate a personalized course without losing your goal or level.</span>`;
      document.querySelector("#course-skill").value = query;
      courseGenerator.hidden = false;
    }
  } catch (error) { skillSearchResult.textContent = error.message || "Skill search failed."; }
}

on(skillSearchForm, "submit", (event) => { event.preventDefault(); searchSkills(skillSearchInput.value.trim()); });
document.querySelectorAll("[data-skill-query]").forEach((button) => button.addEventListener("click", () => searchSkills(button.dataset.skillQuery)));
on(courseForm, "submit", async (event) => {
  event.preventDefault();
  const button = courseForm.querySelector("button");
  button.disabled = true;
  button.textContent = "Building path...";
  const data = Object.fromEntries(new FormData(courseForm).entries());
  try {
    const response = await fetch("/courses/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "Course generation failed.");
    renderCourse(body.course, body.cached);
  } catch (error) { generatedCourse.hidden = false; generatedCourse.textContent = error.message || "Course generation failed."; }
  finally { button.disabled = false; button.innerHTML = "Generate course <span>→</span>"; }
});

function showResult(container, title, text, isError = false) {
  container.hidden = false;
  container.innerHTML = `<h3>${title}</h3><div class="result-text${isError ? " error" : ""}"></div>`;
  container.querySelector(".result-text").textContent = text;
  container.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function addMentorMessage(role, message, question = "") {
  const item = document.createElement("div");
  item.className = `mentor-message ${role}`;
  item.innerHTML = `<span class="message-label">${role === "ai" ? "MENTOR" : "YOU"}</span><p></p>${question ? "<small></small>" : ""}`;
  item.querySelector("p").textContent = message;
  if (question) item.querySelector("small").textContent = question;
  mentorConversation.appendChild(item);
  mentorConversation.scrollTop = mentorConversation.scrollHeight;
}

async function askMentor(message, requestedHint = hintLevel) {
  addMentorMessage("student", message);
  const button = mentorForm.querySelector("button");
  button.disabled = true;
  button.textContent = "Thinking...";
  try {
    const response = await fetch("/mentor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, mode: mentorMode, topic: mentorTopic.value, level: "Beginner", hint_level: requestedHint })
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "The mentor is unavailable.");
    hintLevel = Number(body.hint_level) || requestedHint;
    addMentorMessage("ai", body.message, body.question || body.practice || "");
  } catch (error) {
    addMentorMessage("ai", error.message || "Something went wrong. Please try again.");
  } finally {
    button.disabled = false;
    button.innerHTML = "Send <span>→</span>";
  }
}

document.querySelectorAll(".mentor-mode").forEach((modeButton) => {
  modeButton.addEventListener("click", () => {
    document.querySelectorAll(".mentor-mode").forEach((item) => item.classList.remove("active"));
    modeButton.classList.add("active");
    mentorMode = modeButton.dataset.mode;
    mentorInput.value = modeButton.dataset.prompt;
    mentorInput.focus();
  });
});

on(document.querySelector("#stuck-button"), "click", () => {
  stuckPanel.hidden = !stuckPanel.hidden;
});

document.querySelectorAll("[data-stuck]").forEach((option) => {
  option.addEventListener("click", () => {
    mentorInput.value = option.dataset.stuck;
    stuckPanel.hidden = true;
    mentorInput.focus();
  });
});

document.querySelectorAll("[data-hint]").forEach((hintButton) => {
  hintButton.addEventListener("click", () => {
    hintLevel = Number(hintButton.dataset.hint);
    askMentor(`Please give me hint ${hintLevel} without giving away the full solution.`, hintLevel);
  });
});

on(mentorForm, "submit", (event) => {
  event.preventDefault();
  const message = mentorInput.value.trim();
  if (!message) return;
  mentorInput.value = "";
  askMentor(message);
});

async function sendRequest(url, options, container, loadingMessage, successTitle) {
  const button = options.button;
  button.disabled = true;
  button.dataset.originalText = button.innerHTML;
  button.innerHTML = loadingMessage;
  try {
    const response = await fetch(url, options.fetchOptions);
    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
      ? await response.json()
      : { error: "The server returned an unexpected response. Please restart Flask and try again." };
    if (!response.ok) throw new Error(body.error || "Something went wrong.");
    showResult(container, successTitle, body.result);
  } catch (error) {
    showResult(container, "We could not finish that", error.message || "Network error. Please try again.", true);
  } finally {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText;
  }
}

on(careerForm, "submit", (event) => {
  event.preventDefault();
  const formData = new FormData(careerForm);
  const data = Object.fromEntries(formData.entries());
  sendRequest("/career", {
    button: careerForm.querySelector("button"),
    loadingMessage: "🤖 AI is analyzing your profile...",
    fetchOptions: { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }
  }, document.querySelector("#career-result"), "🤖 AI is analyzing your profile...", "Your personalized career guidance");
});

on(resumeFile, "change", () => {
  validateResumeFile(resumeFile.files[0]);
});

function validateResumeFile(file) {
  if (!file) {
    fileLabel.textContent = "Drop your resume here or browse";
    return false;
  }
  if (!file.name.toLowerCase().endsWith(".pdf") || (file.type && file.type !== "application/pdf")) {
    fileLabel.textContent = "Please choose a PDF file";
    resumeFile.value = "";
    return false;
  }
  if (file.size > 5 * 1024 * 1024) {
    fileLabel.textContent = "PDF must be smaller than 5 MB";
    resumeFile.value = "";
    return false;
  }
  fileLabel.textContent = file.name;
  return true;
}

const uploadBox = document.querySelector(".upload-box");
on(uploadBox, "dragover", (event) => {
  event.preventDefault();
  uploadBox.classList.add("is-dragging");
});
on(uploadBox, "dragleave", () => uploadBox?.classList.remove("is-dragging"));
on(uploadBox, "drop", (event) => {
  event.preventDefault();
  uploadBox.classList.remove("is-dragging");
  const [file] = event.dataTransfer.files;
  if (file && validateResumeFile(file)) {
    const transfer = new DataTransfer();
    transfer.items.add(file);
    resumeFile.files = transfer.files;
  }
});

on(resumeForm, "submit", (event) => {
  event.preventDefault();
  if (!validateResumeFile(resumeFile.files[0])) return;
  const formData = new FormData(resumeForm);
  sendRequest("/resume", {
    button: resumeForm.querySelector("button"),
    loadingMessage: "📄 AI is analyzing your resume...",
    fetchOptions: { method: "POST", body: formData }
  }, document.querySelector("#resume-result"), "📄 AI is analyzing your resume...", "Your resume analysis");
});
