import React from "react";
import { Link } from "react-router-dom";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";
import YouTubeIcon from "@material-ui/icons/YouTube";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TwitterIcon from "@material-ui/icons/Twitter";
import { Button } from "react-bootstrap";
function Footer() {
    return (
        <div className="footer-container">
            <section className="footer-subscription">
                <p className="footer-subscription-heading">
                    Join our exclusive membership to receive the latest news and
                    trends
                </p>
                <p className="footer-subscription-text">
                    You can unsubscribe at any time.
                </p>
                <div className="input-areas">
                    <form>
                        <input
                            className="footer-input"
                            name="email"
                            type="email"
                            placeholder="Your Email"
                        />
                        <Button>Subscribe</Button>
                    </form>
                </div>
            </section>
            <div className="footer-links">
                <div className="footer-link-wrapper">
                    <div className="footer-link-items">
                        <h2>About Us</h2>
                        <Link to="/sign-up">How it works</Link>
                        <Link to="/">Testimonials</Link>
                        <Link to="/">Careers</Link>
                        <Link to="/">Investors</Link>
                        <Link to="/">Terms of Service</Link>
                    </div>
                    <div className="footer-link-items">
                        <h2>Contact Us</h2>
                        <Link to="/">Contact</Link>
                        <Link to="/">Support</Link>
                        <Link to="/">Destinations</Link>
                        <Link to="/">Sponsorships</Link>
                    </div>
                </div>
                <div className="footer-link-wrapper">
                    <div className="footer-link-items">
                        <h2>Videos</h2>
                        <Link to="/">Submit Video</Link>
                        <Link to="/">Ambassadors</Link>
                        <Link to="/">Agency</Link>
                        <Link to="/">Influencer</Link>
                    </div>
                    <div className="footer-link-items">
                        <h2>Social Media</h2>
                        <Link to="/">Instagram</Link>
                        <Link to="/">Facebook</Link>
                        <Link to="/">Youtube</Link>
                        <Link to="/">Twitter</Link>
                    </div>
                </div>
            </div>
            <section className="social-media">
                <div className="social-media-wrap">
                    <div className="footer-logo">
                        <Link to="/" className="social-logo">
                            <img
                                src="../../../../../logo_meadical.png"
                                alt="logo"
                                height="45"
                            />
                        </Link>
                    </div>
                    <small className="website-rights">
                        Madical Care © 2021
                    </small>
                    <div className="social-icons">
                        <Link
                            className="social-icon-link"
                            to="/"
                            target="_blank"
                            aria-label="Facebook"
                        >
                            <FacebookIcon />
                        </Link>
                        <Link
                            className="social-icon-link"
                            to="/"
                            target="_blank"
                            aria-label="Instagram"
                        >
                            <InstagramIcon />
                        </Link>
                        <Link
                            className="social-icon-link"
                            to={
                                "//www.youtube.com/channel/UCsKsymTY_4BYR-wytLjex7A?view_as=subscriber"
                            }
                            target="_blank"
                            aria-label="Youtube"
                        >
                            <YouTubeIcon />
                        </Link>
                        <Link
                            className="social-icon-link"
                            to="/"
                            target="_blank"
                            aria-label="Twitter"
                        >
                            <TwitterIcon />
                        </Link>
                        <Link
                            className="social-icon-link"
                            to="/"
                            target="_blank"
                            aria-label="LinkedIn"
                        >
                            <LinkedInIcon />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Footer;
