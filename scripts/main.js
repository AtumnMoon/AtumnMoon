// Content switching: one page, three views, driven by the URL hash.
// Without JavaScript every section is simply visible and the nav links scroll to them.
const views = [...document.querySelectorAll("main > .view")];
const links = [...document.querySelectorAll(".nav-link")];
const DEFAULT_VIEW = "introduction";

function currentId() {
	const id = location.hash.slice(1);
	return views.some((v) => v.id === id) ? id : DEFAULT_VIEW;
}

function render(id) {
	for (const view of views) view.hidden = view.id !== id;
	for (const link of links) {
		if (link.hash === `#${id}`) link.setAttribute("aria-current", "page");
		else link.removeAttribute("aria-current");
	}
}

function show(id, { focus = false } = {}) {
	const update = () => {
		render(id);
		window.scrollTo(0, 0);
		if (focus) {
			const heading = document.getElementById(id)?.querySelector("h2");
			heading?.setAttribute("tabindex", "-1");
			heading?.focus({ preventScroll: true });
		}
	};
	if (document.startViewTransition) document.startViewTransition(update);
	else update();
}

render(currentId());
addEventListener("hashchange", () => show(currentId(), { focus: true }));

// Contact form: no backend, so hand the message to the visitor's mail app.
document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
	event.preventDefault();
	const data = new FormData(event.currentTarget);
	const name = `${data.get("first-name")} ${data.get("last-name")}`.trim();
	const body = `${data.get("message")}\n\n${name}\n${data.get("email")}`;
	location.href =
		`mailto:olleresjayandrei@gmail.com?subject=${encodeURIComponent(`Portfolio message from ${name}`)}` +
		`&body=${encodeURIComponent(body)}`;
});
