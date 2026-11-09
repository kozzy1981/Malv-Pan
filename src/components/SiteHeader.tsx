import Image from "next/image";
import Link from "next/link";

/** Shared brand header. Navigation stays simple until site-wide features are in scope. */
export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="utility-bar">
        <div className="content-width utility-content">
          <span>English</span>
          <a href="https://www.malvernpanalytical.com/">Visit our website <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="content-width header-content">
        <Link className="brand-link" href="/" aria-label="Malvern Panalytical home">
          <Image src="/images/malvern-panalytical-logo.png" alt="Malvern Panalytical" width={198} height={70} priority />
        </Link>
        <nav aria-label="Main navigation">
          <ul className="header-navigation">
            <li><a href="#products">Products</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
