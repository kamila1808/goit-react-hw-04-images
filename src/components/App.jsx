import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { fetchImages } from './services/Api';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { mapped } from './services/Mapper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [largeImage, setLargeImage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalHits, setTotalHits] = useState(0);

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }

    setIsLoading({ isLoading: true });
    fetchImages(searchQuery, page)
      .then(response => {
        if (!response.ok) {
          return;
        } else {
          return response.json();
        }
      })
      .then(response => {
        if (response.hits.length === 0) {
          return toast.error('По вашему запросу ничего не нашлось');
        }
        setImages(prev => [...prev, ...mapped(response.hits)]);
        setTotalHits(response.totalHits);
      })
      .catch(error => {
        setError({ error });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchQuery, page]);

  const onSubmit = searchQuery => {
    if (searchQuery.trim() === '') {
      return toast.error('Введите название для поиска');
    }
    setSearchQuery(searchQuery);
    setImages([]);
    setPage(1);
    setIsLoading(false);
  };

  const nextPage = () => {
    setIsLoading(true);
    setPage(prevPage => prevPage + 1);
  };

  const openModal = index => {
    setShowModal(true);
    setLargeImage(images[index].largeImageURL);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const isNotLastPage = images.length / page === 12;
  const showButton = images.length > 0 && !isLoading && isNotLastPage;

  return (
    <div>
      <Searchbar onSubmit={onSubmit} />
      {images.length !== 0 && (
        <ImageGallery images={images} openModal={openModal} />
      )}
      {isLoading && <Loader />}
      {showButton && <Button nextPage={nextPage} />}
      {showModal && <Modal toggleModal={toggleModal} largeImage={largeImage} />}
      <ToastContainer autoClose={2000} />
    </div>
  );
};
