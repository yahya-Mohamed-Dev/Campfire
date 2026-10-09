import { useEffect, useRef, useState } from "react";

const dialogViews = {
  signup: {
    title: "Your people are here.",
    description: "Start your own cozy corner. It only takes a second.",
    button: "Create your account"
  },
  login: {
    title: "Welcome back.",
    description: "Your corner of the internet missed you.",
    button: "Send me a sign-in link"
  },
  contact: {
    title: "Say hello.",
    description: "Leave your email and our tiny team will get back to you.",
    button: "Get in touch"
  }
};

const channels = {
  general: "a little bit of everything",
  "tiny-wins": "celebrate the little things",
  "game-room": "play something together"
};
const tickerPhrases = ["GOOD VIBES ONLY", "YOUR KIND OF PEOPLE", "STAY A LITTLE LONGER"];

function Button({ variant = "primary", size, className = "", children, ...props }) {
  return <button className={`button button-${variant}${size ? ` button-${size}` : ""} ${className}`.trim()} {...props}>{children}</button>;
}

function Header({ onOpenDialog, dark, onToggleTheme }) {
  const [navOpen, setNavOpen] = useState(false);

  function closeMenu() {
    setNavOpen(false);
  }

  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-lg container py-3" aria-label="Main navigation">
        <a className="navbar-brand brand" href="#home" aria-label="Campfire home">
          <span className="brand-mark" aria-hidden="true">✳</span> campfire
        </a>
        <button className="navbar-toggler" type="button" aria-label="Toggle navigation" aria-expanded={navOpen} onClick={() => setNavOpen((open) => !open)}>
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`nav-content${navOpen ? " open" : ""}`}>
          <div className="navbar-nav mx-auto">
            <a className="nav-link" href="#features" onClick={closeMenu}>Why Campfire</a>
            <a className="nav-link" href="#communities" onClick={closeMenu}>Communities</a>
            <a className="nav-link" href="#safety" onClick={closeMenu}>Safety</a>
          </div>
          <div className="nav-actions">
            <button className="theme-toggle" type="button" aria-label={`Switch to ${dark ? "light" : "dark"} mode`} title="Toggle dark mode" onClick={onToggleTheme}>
              <span className="theme-icon" aria-hidden="true">{dark ? "☀" : "☾"}</span>
            </button>
            <Button variant="dark" className="nav-login" onClick={() => onOpenDialog("login")}>Log in</Button>
            <Button className="nav-start" onClick={() => onOpenDialog("signup")}>Get started</Button>
          </div>
        </div>
      </nav>
    </header>
  );
}

function ChatPreview({ onOpenDialog, onToast }) {
  const [channel, setChannel] = useState("general");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, avatar: "🌻", avatarClass: "avatar-yellow", name: "milo", time: "7:42 PM", text: "okay important question: what are we watching tonight?" },
    { id: 2, avatar: "🧋", avatarClass: "avatar-lilac", name: "bea", time: "7:43 PM", text: "the one with the tiny dragons obviously 🐉", reaction: true },
    { id: 3, avatar: "🪴", avatarClass: "avatar-green", name: "sage", time: "7:44 PM", text: "already made snacks. I'm emotionally prepared." }
  ]);

  function sendMessage(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, {
      id: Date.now(),
      avatar: "🦊",
      avatarClass: "avatar-lilac",
      name: "juniper",
      time: new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date()),
      text
    }]);
    setDraft("");
  }

  return (
    <div className="chat-stage reveal" aria-label="Interactive chat room preview">
      <div className="floating-note note-top"><span className="note-icon">✦</span><span>the gang is here</span><span className="online-dot" /></div>
      <div className="chat-window">
        <aside className="server-rail" aria-label="Community selector">
          <button className="server-logo active" aria-label="Campfire community" onClick={() => onToast("You're already at the cozy corner ✳")}>✳</button>
          <button className="server-logo server-peach" aria-label="Art club" onClick={() => onToast("Art club is just around the corner ✳")}>🎨</button>
          <button className="server-logo server-lime" aria-label="Game night" onClick={() => onToast("Game night is just around the corner ✳")}>🎮</button>
          <button className="server-add" aria-label="Add a community" onClick={() => onOpenDialog("signup")}>+</button>
        </aside>
        <aside className="channel-sidebar">
          <div className="community-title">the cozy corner <span>⌄</span></div>
          <div className="channel-label">YOUR SPACES</div>
          {Object.keys(channels).map((name) => (
            <button key={name} className={`channel${channel === name ? " active" : ""}`} onClick={() => setChannel(name)}>
              <span>{name === "game-room" ? "♫" : "#"}</span> {name}
            </button>
          ))}
          <div className="voice-card"><span className="voice-wave">◖))</span><div><strong>hanging out</strong><small>3 friends in voice</small></div><span className="voice-live" /></div>
          <div className="profile-card"><span className="profile-avatar">🦊</span><span><strong>juniper</strong><small>here for a good time</small></span><span className="profile-menu">···</span></div>
        </aside>
        <section className="conversation">
          <div className="conversation-head"><span className="hash">#</span><strong className="current-channel">{channel}</strong><span className="head-divider" /><span className="conversation-topic">{channels[channel]}</span><button className="chat-more" aria-label="More chat options" onClick={() => onToast("You're all caught up in this cozy corner.")}>···</button></div>
          <div className="messages" aria-live="polite">
            <div className="day-divider"><span>MONDAY, 7:42 PM</span></div>
            {messages.map((message) => (
              <div className="message" key={message.id}>
                <span className={`message-avatar ${message.avatarClass}`}>{message.avatar}</span>
                <div><div className="message-meta"><strong>{message.name}</strong><time>{message.time}</time></div><p>{message.text}</p>{message.reaction && <div className="reaction">✨ <span>3</span></div>}</div>
              </div>
            ))}
          </div>
          <form className="chat-compose" onSubmit={sendMessage}>
            <button type="button" className="compose-add" aria-label="Add attachment" onClick={() => onToast("Attachments are coming soon ✳")}>+</button>
            <input aria-label="Write a message" placeholder={`Message #${channel}`} maxLength={180} value={draft} onChange={(event) => setDraft(event.target.value)} />
            <button className="send-button" aria-label="Send message" type="submit">↑</button>
          </form>
        </section>
      </div>
      <div className="floating-note note-bottom"><span className="typing-dots"><i /><i /><i /></span><span>bea is typing</span></div>
      <span className="decor decor-star">✳</span><span className="decor decor-heart">♥</span>
    </div>
  );
}

function ActivityTicker() {
  const phrases = Array.from({ length: 6 }, () => tickerPhrases).flat();

  return (
    <section className="ticker" aria-label="Campfire activities">
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <div className="ticker-group" key={copy} aria-hidden={copy === 1}>
            {phrases.map((phrase, index) => (
              <span className="ticker-item" key={`${copy}-${index}`}>
                {phrase}<b aria-hidden="true">✳</b>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function Dialog({ view, onClose, onToast }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const element = dialogRef.current;
    if (view && element && !element.open) element.showModal();
    if (!view && element?.open) element.close();
  }, [view]);

  function handleSubmit(event) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    onClose();
    onToast(`You're on the list, ${email}! See you around ✳`);
  }

  return (
    <dialog ref={dialogRef} className="action-dialog" aria-labelledby="dialog-title" onClose={onClose} onClick={(event) => {
      if (event.target === dialogRef.current) onClose();
    }}>
      <button className="dialog-close" aria-label="Close dialog" onClick={onClose}>×</button>
      <div className="dialog-mark">✳</div>
      {view === "safety" ? (
        <div className="dialog-content">
          <h2 id="dialog-title">Good spaces start with care.</h2>
          <p>Everyone deserves a place where they feel welcome and respected.</p>
          <ul className="safety-points"><li>Choose who can join your spaces</li><li>Set clear community guidelines</li><li>Mute, block, or report when you need to</li></ul>
          <button className="button button-primary safety-done" onClick={onClose}>Got it</button>
        </div>
      ) : (
        <div className="dialog-content">
          <h2 id="dialog-title">{dialogViews[view]?.title ?? dialogViews.signup.title}</h2>
          <p>{dialogViews[view]?.description ?? dialogViews.signup.description}</p>
          <form className="dialog-form" onSubmit={handleSubmit}>
            <label htmlFor="dialog-email">Your email</label>
            <input id="dialog-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
            <button className="button button-primary" type="submit">{dialogViews[view]?.button ?? dialogViews.signup.button} <span aria-hidden="true">↗</span></button>
          </form>
          <p className="dialog-note">No spam, just good company.</p>
        </div>
      )}
    </dialog>
  );
}

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("campfire-theme") === "dark");
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", dark);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#191624" : "#f7f7fc");
    localStorage.setItem("campfire-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  function showToast(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2800);
  }

  return (
    <>
      <Header onOpenDialog={setDialog} dark={dark} onToggleTheme={() => setDark((current) => !current)} />
      <main>
        <section className="hero section-pad" id="home">
          <div className="hero-glow hero-glow-one" /><div className="hero-glow hero-glow-two" />
          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <div className="eyebrow"><span className="eyebrow-spark">✦</span> Your people are waiting</div>
              <h1>Where your<br />people <span className="highlight">hang out.</span></h1>
              <p className="hero-description">A little corner of the internet for big laughs, late-night talks, and the friends who just get you.</p>
              <div className="hero-actions">
                <Button size="large" onClick={() => setDialog("signup")}>Find your people <span aria-hidden="true">↗</span></Button>
                <a className="button button-light button-large" href="#features"><span className="play-icon" aria-hidden="true">▶</span> See what it's about</a>
              </div>
              <div className="social-proof"><div className="avatar-stack" aria-hidden="true"><span>🌻</span><span>🧋</span><span>🦊</span><span>🪴</span></div><p><strong>Made for the group chat</strong><br />and the friends behind it.</p></div>
            </div>
            <ChatPreview onOpenDialog={setDialog} onToast={showToast} />
          </div>
        </section>

        <ActivityTicker />

        <section className="features-section section-pad" id="features">
          <div className="container">
            <div className="section-heading reveal"><div className="eyebrow">A place to be yourself</div><h2>Less scrolling.<br /><span>More belonging.</span></h2><p>Everything you need to make your group feel like your group.</p></div>
            <div className="row g-4 feature-grid">
              <div className="col-md-4 reveal"><article className="feature-card feature-lilac"><div className="feature-art art-orbit"><span>☁</span><i>✦</i><b>♡</b></div><div className="feature-copy"><span className="feature-number">01 / TALK</span><h3>Conversations<br />that flow.</h3><p>Pop in for a quick hello or settle into a chat that lasts all night.</p></div></article></div>
              <div className="col-md-4 reveal"><article className="feature-card feature-yellow"><div className="feature-art art-game"><span>🎲</span><i>✳</i><b>♫</b></div><div className="feature-copy"><span className="feature-number">02 / PLAY</span><h3>Make a night<br />of nothing.</h3><p>Share a playlist, start a game, or just see where the evening goes.</p></div></article></div>
              <div className="col-md-4 reveal"><article className="feature-card feature-peach"><div className="feature-art art-heart"><span>♥</span><i>✦</i><b>✿</b></div><div className="feature-copy"><span className="feature-number">03 / BELONG</span><h3>Your space.<br />Your people.</h3><p>Create a cozy corner for your friends, your fandom, or your next big idea.</p></div></article></div>
            </div>
          </div>
        </section>

        <section className="community-section section-pad" id="communities">
          <div className="container community-grid">
            <div className="community-copy reveal"><div className="eyebrow">There's a seat for you</div><h2>Find your<br /><span>kind of weird.</span></h2><p>From hobby buddies to the friends you haven't met yet, good company is closer than you think.</p><Button variant="light" size="large" onClick={() => setDialog("signup")}>Explore communities <span aria-hidden="true">↗</span></Button></div>
            <div className="community-art reveal"><div className="orbit orbit-outer" /><div className="orbit orbit-inner" /><div className="community-sticker sticker-one">🎨<small>art pals</small></div><div className="community-sticker sticker-two">🎧<small>music heads</small></div><div className="community-sticker sticker-three">🌱<small>plant people</small></div><div className="community-sticker sticker-four">🕹️<small>game night</small></div><div className="community-center">✳<span>come on<br />in!</span></div><span className="community-spark spark-a">✦</span><span className="community-spark spark-b">✳</span></div>
          </div>
        </section>

        <section className="safety-section section-pad" id="safety">
          <div className="container safety-inner reveal"><div className="safety-icon">♡</div><div><div className="eyebrow">Good people, good boundaries</div><h2>Feel at home.<br /><span>And in control.</span></h2><p>Your spaces should feel good to be in. Make them yours with simple tools to set the tone and look out for each other.</p></div><Button variant="dark" onClick={() => setDialog("safety")}>Our safety promise <span aria-hidden="true">↗</span></Button></div>
        </section>

        <section className="closing-section"><div className="container closing-content reveal"><span className="closing-spark">✳</span><h2>Your people.<br />Your place.</h2><p>Come find your corner of the internet.</p><Button variant="dark" size="large" onClick={() => setDialog("signup")}>Let's hang out <span aria-hidden="true">↗</span></Button><div className="closing-doodle">♡ &nbsp; ✦ &nbsp; ♡</div></div></section>
      </main>
      <footer className="site-footer"><div className="container footer-content"><a className="brand" href="#home"><span className="brand-mark">✳</span> campfire</a><p>Made for the moments that matter.</p><div className="footer-links"><a href="#features">About</a><a href="#safety">Safety</a><button onClick={() => setDialog("contact")}>Say hello</button></div><span className="copyright">© {new Date().getFullYear()} Campfire Club</span></div></footer>
      <Dialog view={dialog} onClose={() => setDialog(null)} onToast={showToast} />
      <div className={`toast-message${toast ? " visible" : ""}`} role="status" aria-live="polite">{toast}</div>
    </>
  );
}

export default App;
