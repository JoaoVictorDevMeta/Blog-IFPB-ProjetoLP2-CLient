import { Link } from 'react-router-dom';

function Autor(props) {
  return (
    <section className="autor-xxl container-xxl p-4 gap-5 d-flex flex-wrap">
      <img
        className="autor-image"
        src={
          props.image ||
          'https://th.bing.com/th/id/OIP.6UhgwprABi3-dz8Qs85FvwHaHa?rs=1&pid=ImgDetMain'
        }
        alt="foto de perfil"
      />
      <div className="autor">
        <Link className="autor-title" to={`/profile/${props.link}`}>
          {props.autor}
        </Link>
        <p className="autor-descricao">
          {props.tipo} | {props.area}{' '}
        </p>
        <p className="autor-text">{props.texto}</p>
      </div>
    </section>
  );
}

export default Autor;
