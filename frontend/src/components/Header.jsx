import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img
            src="./src/assets/logo-placeholder.png"
            alt="logo"
            className="logo"
          />
        </Link>
      </div>
      <div className="title-container">
        <h1 className="title">Сдам ГИА: РЕШУ ОГЭ</h1>
        <div className="website-descr">
          Образовательный портал для подготовки к экзаменам
        </div>
      </div>
    </header>
  );
};

export default Header;
