import { Icon } from "./Icon";
import { Divider, SectionHeading } from "./Ornaments";
import SmartImage from "./SmartImage";

export default function Invitation({ copy }) {
  const invite = copy.invite;

  return (
    <section className="section invitation" id="invitation" aria-labelledby="invitation-title">
      <div className="invitation__watermark" aria-hidden="true">
        <span>{copy.brands.monogram}</span>
      </div>

      <div className="container">
        <SectionHeading
          kicker={invite.kicker}
          title={invite.title}
          id="invitation-title"
        />

        <div className="invitation__grid">
          <div className="invitation__visual" data-reveal>
            <div className="portrait">
              <span className="portrait__corner portrait__corner--tl" aria-hidden="true" />
              <span className="portrait__corner portrait__corner--tr" aria-hidden="true" />
              <span className="portrait__corner portrait__corner--bl" aria-hidden="true" />
              <span className="portrait__corner portrait__corner--br" aria-hidden="true" />
              <div className="portrait__arch">
                <SmartImage
                  src="/images/Sundeep-Neeraja.png"
                  alt={copy.hero.imageAlt}
                  fallbackLabel={invite.portraitLabel}
                  fallbackNote={invite.portraitNote}
                />
              </div>
              <div className="portrait__plaque">
                <span>{invite.portraitCaption}</span>
                <small>{invite.dateLabel}</small>
              </div>
            </div>

            <div className="invitation__quote">
              <Icon name="quote" size={22} />
              <p>{invite.quote}</p>
            </div>
          </div>

          <div className="invite-card" data-reveal>
            <div className="invite-card__ornament" aria-hidden="true">
              <span className="om-circle om-circle--small">
                <span className="om-circle__inner">ॐ</span>
              </span>
            </div>

            <p className="invite-card__om" lang="ml">
              {invite.om}
            </p>

            <p className="invite-card__hosts">{invite.hosts}</p>
            <p className="invite-card__address">{invite.address}</p>

            <Divider className="invite-card__divider" />

            <p className="invite-card__intro">{invite.intro}</p>

            <div className="invite-card__names">
              <span className="invite-card__name">{invite.groomName}</span>
              <span className="invite-card__with">
                <span aria-hidden="true" />
                {invite.with}
                <span aria-hidden="true" />
              </span>
              <span className="invite-card__name">{invite.brideName}</span>
            </div>

            <p className="invite-card__after">{invite.afterNames}</p>
            <p className="invite-card__closing">{invite.closing}</p>

            <div className="invite-card__details">
              <div className="invite-detail">
                <span className="invite-detail__icon">
                  <Icon name="calendar" size={18} />
                </span>
                <span>
                  <small>{invite.dateSmall}</small>
                  <strong>{invite.dateLabel}</strong>
                  <em>{invite.malayalamDate}</em>
                </span>
              </div>
              <div className="invite-detail">
                <span className="invite-detail__icon">
                  <Icon name="clock" size={18} />
                </span>
                <span>
                  <small>{invite.muhurthamSmall}</small>
                  <strong>{invite.muhurthamLabel}</strong>
                </span>
              </div>
              <div className="invite-detail">
                <span className="invite-detail__icon">
                  <Icon name="mapPin" size={18} />
                </span>
                <span>
                  <small>{invite.venueSmall}</small>
                  <strong>{invite.venueLabel}</strong>
                </span>
              </div>
            </div>

            <div className="invite-card__signature">
              <span>{invite.signature}</span>
              <strong>{invite.signatureName}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
