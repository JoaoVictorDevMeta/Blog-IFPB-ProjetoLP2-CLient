import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAddBlog from '../../data/hooks/newpost/useAddBlog';
import {
  updateBlogCellTitle,
  updateBlogCellContent,
  updateBlogCellImage,
  addBlogCell,
  deleteBlogCell,
} from './functions/BlogLogic';

import './NewPost.css';
import Swal from 'sweetalert2';
import BlogCellsTransitionGroup from '../../ui/partials/NewPost/BlogGroupCell';
import { BlogPreview } from '../../ui/partials/NewPost/BlogPreview';
import { BlogErrors } from '../../ui/partials/NewPost/BlogErrors';

const NewPost = () => {
  const [blogCells, setBlogCells] = useState([
    { id: 1, title: '', content: '', image: File },
  ]);
  const [hasError, setHasError] = useState(false);
  const [blogCellsErrors, setBlogCellsErrors] = useState([
    { id: 1, title: '', content: '' },
  ]);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogDescription, setBlogDescription] = useState('');
  const [referenceText, setReferenceText] = useState('');
  const [references, setReferences] = useState([]);
  const [blogPreviwOn, setBlogPreviewOn] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({ mode: 'onBlur' });
  const {
    isLoading: isAdding,
    error: addError,
    data: addData,
    execute: addBlog,
  } = useAddBlog();

  //Reference Logic
  const addReference = (newReference) => {
    if (referenceText.length < 3) return;
    setReferences([...references, newReference]);
    setReferenceText('');
  };

  const validateBlogCells = () => {
    let isValid = true;
    const updatedErrors = blogCells.map((cell) => {
      let cellError = { id: cell.id, title: '', content: '' };
      if (cell.title.trim() === '') {
        isValid = false;
        cellError.title = 'Título não pode estar vazio';
      }
      if (cell.content.trim() === '') {
        isValid = false;
        cellError.content = 'Conteúdo não pode estar vazio';
      }
      return cellError;
    });

    setBlogCellsErrors(updatedErrors);
    return isValid;
  };

  //Submit Logic
  const userPost = (data) => {
    setHasError(false);
    if (!validateBlogCells()) {
      setHasError(true);
      return;
    }

    //title and description
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('subTitle', data.description);
    formData.append('category', 'Projeto');

    //blogcell images
    blogCells.forEach((cell) => {
      if (cell.image) {
        formData.append('image', cell.image);
      } else {
        formData.append('image', '');
      }
    });

    //blogcell content
    const blogPosts = blogCells.map((cell) => {
      return {
        title: cell.title,
        content: cell.content,
      };
    });
    const blogPostsJson = JSON.stringify(blogPosts);
    formData.append('posts', blogPostsJson);

    //console.log(formData);
    addBlog(formData).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Publicado com sucesso!',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate(`/blog/${addData[0].id}`); 
      });
    });
    //console.log(addData);
  };

  document.body.classList.toggle('no-scroll', isAdding);

  return (
    <>
      {isAdding && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      <form
        className="container-xxl conteudo-xxl mt-5 py-5 px-0 form-blog"
        onSubmit={handleSubmit(userPost)}
      >
        <section hidden={!blogPreviwOn}>
          <BlogPreview
            blogCells={blogCells}
            title={blogTitle}
            description={blogDescription}
          />
        </section>
        <section hidden={blogPreviwOn}>
          <div className="blog-header text-center">
            <label className="fs-1" htmlFor="titulo">
              Título
            </label>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: 'Título do blog não pode estar vazio',
                },
                minLength: {
                  value: 10,
                  message: 'Título do blog muito pequeno',
                },
                pattern: {
                  value:
                    /^[A-Za-z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ.,;:!? ]+$/i,
                  message:
                    'Título: apenas letras, números e pontuações são permitidos',
                },
              }}
              render={({ field }) => (
                <input
                  type="text"
                  className="titulo-blog"
                  id="titulo"
                  onChange={(e) => {
                    field.onChange(e);
                    setBlogTitle(e.target.value);
                  }}
                  value={blogTitle}
                />
              )}
            />
          </div>

          <BlogCellsTransitionGroup
            blogCells={blogCells}
            setBlogCells={setBlogCells}
            addBlogCell={addBlogCell}
            deleteBlogCell={deleteBlogCell}
            updateCellTitle={updateBlogCellTitle}
            updateCellContent={updateBlogCellContent}
            updateCellImage={updateBlogCellImage}
          />
        </section>
        <aside>
          <button
            type="button"
            className="rounded-edge w-100 mb-3"
            onClick={() => {
              setBlogPreviewOn(!blogPreviwOn);
            }}
          >
            {blogPreviwOn ? 'Voltar para Edição' : 'Visualizar'}
          </button>
          <div hidden={!blogPreviwOn}>
            {((errors && Object.keys(errors).length > 0) || hasError) && (
              <BlogErrors errors={errors} cellErrors={blogCellsErrors} />
            )}
          </div>
          <div hidden={blogPreviwOn}>
            <div className="blog-head-container blog-card">
              QUAL CATEGORIA SEU PROJETO SE ENCAIXA?
            </div>
            <button
              type="submit"
              className="rounded-edge w-100 mb-3"
              disabled={false}
            >
              {isAdding ? '...' : 'Publicar'}
            </button>
            {((errors && Object.keys(errors).length > 0) || hasError) && (
              <div className="alert alert-danger" role="alert">
                Seu blog possui campos incompletos ou inválidos, por favor,
                corrija-os antes de publicar.
              </div>
            )}
            {addError && (
              <div className="alert alert-danger" role="alert">
                Você precisa estar logado para publicar um blog.
              </div>
            )}
            <h2>Descricao</h2>
            <div className="blog-description-container blog-card">
              <Controller
                name="description"
                control={control}
                defaultValue=""
                rules={{
                  required: {
                    value: true,
                    message: 'Descrição do blog não pode estar vazia',
                  },
                  minLength: {
                    value: 20,
                    message: 'Descrição do blog muito pequena',
                  },
                  pattern: {
                    value:
                      /^[A-Za-z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ.,;:!? ]+$/i,
                    message:
                      'Descrição: apenas letras, números e pontuações são permitidos',
                  },
                }}
                render={({ field }) => (
                  <textarea
                    className="lined-input"
                    onChange={(e) => {
                      field.onChange(e);
                      setBlogDescription(e.target.value);
                    }}
                    value={blogDescription}
                  ></textarea>
                )}
              />
            </div>
            <h2>Referencias</h2>
            <div className="blog-reference-container blog-card">
              <div className="reference-input d-flex flex-column">
                <textarea
                  className="lined-input"
                  style={{ height: '6em' }}
                  value={referenceText}
                  onChange={(e) => setReferenceText(e.target.value)}
                ></textarea>
                <button
                  className="simple-button"
                  type="button"
                  onClick={() => addReference(referenceText)}
                >
                  Adicionar
                </button>

                {referenceText.length > 0 && referenceText.length < 3 && (
                  <span className="text-danger">
                    A referência deve conter no mínimo 3 caracteres.
                  </span>
                )}
              </div>
              {references.length === 0 ? (
                <p className="fs-4 d-block">Adicione aqui suas referências</p>
              ) : (
                <ul className="d-flex flex-column p-0 reference-list">
                  {references.map((reference, index) => (
                    <li key={index}>
                      <span>{reference}</span>
                      <button
                        type="button"
                        onClick={() => removeReference(index)}
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </aside>
      </form>
    </>
  );
};

export default NewPost;
