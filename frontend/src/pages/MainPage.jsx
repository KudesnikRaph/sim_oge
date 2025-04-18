import "./MainPage.css";
import { Link } from "react-router-dom";
import VariantConstructor from "../components/VariantConstructor";

const Main = ({ variantsList }) => {
  return (
    <>
      <section className="section">
        <h2>Тренировочные варианты</h2>
        <ul className="variants-list">
          {variantsList.map((v) => (
            <li className="variants-list__item" key={v.id}>
              <Link to={`/test/${v.id}`} className="variants-list__link">{v.name}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="section">
        <h2>Конструктор варианта по темам</h2>
        <p className="descr">
          Что­бы це­ле­на­прав­лен­но тре­ни­ро­вать­ся по опре­де­лён­ным
          те­мам, вы мо­же­те со­ста­вить ва­ри­ант из необ­хо­ди­мо­го
          ко­ли­че­ства за­да­ний по кон­крет­ным раз­де­лам за­дач­но­го
          ка­та­ло­га. Для быст­ро­го со­став­ле­ния ти­по­во­го ва­ри­ан­та
          ис­поль­зуй­те кноп­ки спра­ва.
        </p>
        <VariantConstructor />
      </section>
    </>
  );
};

export default Main;
