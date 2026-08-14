function Footer() {
  return (
    <footer
      className="d-flex flex-column-reverse flex-sm-row align-items-center justify-content-between p-2 text-center border-top"
      style={{ color: "gold" }}
    >
      <span>Copyrights &copy; 2017 Pizzeria. All rights reserved</span>
      <span>
        Developed by{" "}
        <a
          href="https://dev-shivam.in"
          className="link-underline-warning link-underline-opacity-0 link-underline-opacity-75-hover"
          style={{ color: "gold" }}
        >
          Shivam
        </a>
      </span>
    </footer>
  );
}

export default Footer;
