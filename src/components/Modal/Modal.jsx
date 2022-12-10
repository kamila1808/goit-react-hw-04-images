import { useEffect } from 'react';
import styles from './Modal.module.css';
import PropTypes from 'prop-types';

export const Modal = ({ toggleModal, largeImage }) => {
  useEffect(() => {
    const handleKeyDown = event => {
      event.code === 'Escape' && toggleModal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleModal]);

  const handleBackdropClick = event => {
    event.target === event.currentTarget && toggleModal();
  };

  return (
    <div className={styles.Overlay} onClick={handleBackdropClick}>
      <div className={styles.Modal}>
        <img src={largeImage} alt="" />
      </div>
    </div>
  );
};

Modal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  largeImage: PropTypes.string.isRequired,
};
