import { useEffect, useState } from "react";
import "./App.css";

type StreamerPlatform = {
  channel_url?: string;
  stream_url?: string;
};

type Streamer = {
  username: string;
  avatar: string;
  twitch_url?: string;
  url?: string;
  is_live: boolean;
  platforms?: StreamerPlatform[];
};

type StreamersResponse = {
  streamers?: Streamer[];
};

function getStreamerUrl(streamer: Streamer) {
  const platform = streamer.platforms?.find(
    (item) => item.channel_url || item.stream_url,
  );

  return (
    streamer.twitch_url ??
    platform?.channel_url ??
    platform?.stream_url ??
    streamer.url
  );
}

function App() {
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"online" | "offline">(
    "online",
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadStreamers() {
      try {
        const response = await fetch("https://api.chess.com/pub/streamers", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Não foi possível carregar os streamers.");
        }

        const data = (await response.json()) as StreamersResponse;

        if (!Array.isArray(data.streamers)) {
          throw new Error(
            "A resposta da API não contém uma lista de streamers.",
          );
        }

        setStreamers(data.streamers);
      } catch {
        if (!controller.signal.aborted) {
          setHasError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadStreamers();

    return () => controller.abort();
  }, []);

  const liveCount = streamers.filter((streamer) => streamer.is_live).length;
  const visibleStreamers = streamers.filter(
    (streamer) => streamer.is_live === (activeFilter === "online"),
  );

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Streamers de xadrez, início">
          <span className="brand-mark" aria-hidden="true">
            C
          </span>
          <span>
            CHESS<span className="brand-light">/STREAMS</span>
          </span>
        </a>
        <span className="topbar-note">Direto do Chess.com</span>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <div className="intro-copy">
          <p className="eyebrow">A comunidade ao vivo</p>
          <h1 id="page-title">
            Streamers
            <br />
            de xadrez<span>.</span>
          </h1>
          <p className="intro-description">
            Encontre um canal, acompanhe a partida e entre no jogo.
          </p>
        </div>
        {!isLoading && !hasError && (
          <div
            className="live-summary"
            aria-label={`${liveCount} ao vivo de ${streamers.length} streamers`}
          >
            <span className="summary-number">
              {liveCount.toString().padStart(2, "0")}
            </span>
            <span className="summary-label">
              <span className="live-dot" /> AO VIVO AGORA
            </span>
          </div>
        )}
      </section>

      <section className="streamer-section" aria-labelledby="list-title">
        <div className="section-heading">
          <h2 id="list-title">Canais</h2>
          {!isLoading && !hasError && (
            <span className="streamer-count">
              {streamers.length}{" "}
              {streamers.length === 1 ? "streamer" : "streamers"}
            </span>
          )}
        </div>

        {!isLoading && !hasError && streamers.length > 0 && (
          <div
            className="streamer-filters"
            role="group"
            aria-label="Filtrar streamers por status"
          >
            <button
              className="filter-button"
              type="button"
              aria-pressed={activeFilter === "online"}
              onClick={() => setActiveFilter("online")}
            >
              <span
                className="filter-dot filter-dot-online"
                aria-hidden="true"
              />
              Onlines <span className="filter-count">{liveCount}</span>
            </button>
            <button
              className="filter-button"
              type="button"
              aria-pressed={activeFilter === "offline"}
              onClick={() => setActiveFilter("offline")}
            >
              <span
                className="filter-dot filter-dot-offline"
                aria-hidden="true"
              />
              Offlines{" "}
              <span className="filter-count">
                {streamers.length - liveCount}
              </span>
            </button>
          </div>
        )}

        {isLoading && (
          <p className="state-message" role="status">
            Carregando streamers...
          </p>
        )}

        {!isLoading && hasError && (
          <p className="state-message" role="alert">
            Não foi possível carregar os streamers. Tente novamente mais tarde.
          </p>
        )}

        {!isLoading && !hasError && streamers.length === 0 && (
          <p className="state-message">Nenhum streamer encontrado.</p>
        )}

        {!isLoading &&
          !hasError &&
          streamers.length > 0 &&
          visibleStreamers.length === 0 && (
            <p className="state-message">
              {activeFilter === "online"
                ? "Nenhum streamer está ao vivo agora."
                : "Nenhum streamer offline no momento."}
            </p>
          )}

        {!isLoading && !hasError && visibleStreamers.length > 0 && (
          <ul className="streamer-list">
            {visibleStreamers.map((streamer) => {
              const streamerUrl = getStreamerUrl(streamer);
              const hasPlatformUrl = Boolean(
                streamer.twitch_url ||
                streamer.platforms?.some(
                  (platform) => platform.channel_url || platform.stream_url,
                ),
              );

              return (
                <li className="streamer-card" key={streamer.username}>
                  <img
                    className="avatar"
                    src={streamer.avatar}
                    alt={`Avatar de ${streamer.username}`}
                  />
                  <div className="streamer-info">
                    <h3>{streamer.username}</h3>
                    <p
                      className={
                        streamer.is_live
                          ? "status status-live"
                          : "status status-offline"
                      }
                    >
                      <span className="status-dot" aria-hidden="true" />
                      {streamer.is_live ? "Ao vivo" : "Offline"}
                    </p>
                  </div>
                  {streamerUrl && (
                    <a
                      className="channel-link"
                      href={streamerUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {hasPlatformUrl ? "Ver canal" : "Ver perfil"}{" "}
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <footer className="page-footer">
        <span>Dados fornecidos pelo Chess.com</span>
        <span>Jogue bem. Assista melhor.</span>
      </footer>
    </main>
  );
}

export default App;
