export function initAnimations() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(entry =>
          entry.target.classList.toggle('motion-off', !entry.isIntersecting)
        ),
      { threshold: 0.03 }
    );

    document
      .querySelectorAll('.section,.hero')
      .forEach(element => observer.observe(element));

    document
      .querySelectorAll('.reveal')
      .forEach(element => element.classList.add('visible'));
  }

  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('page-hidden', document.hidden);
  });
}
