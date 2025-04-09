import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { deleteBook } from '../api/bookAPI';

function BookCard({ bookObj, onUpdate }) {
  const deleteThisBook = () => {
    if (window.confirm(`Are you 1000% positive you want to delete ${bookObj.title}? This action cannot be undone.`)) {
      deleteBook(bookObj.firebaseKey).then(() => {
        onUpdate();
      });
    }
  };

  return (
    <Card className="bookCard" style={{ width: '18rem' }}>
      <Card.Img className="imageFormat" variant="top" src={bookObj.coverImage} />
      <Card.Body>
        <Card.Title>{bookObj.title}</Card.Title>
        <Link href={`/author/${bookObj.authorID}`} passHref>
          <Button variant="primary" className="m-2">View Author Details</Button>
        </Link>
        <Link href={`/books/edit/${bookObj.firebaseKey}`} passHref>
          <Button variant="info">Edit Book</Button>
        </Link>
        <Button variant="danger" onClick={deleteThisBook} className="m-2">Delete Book</Button>
      </Card.Body>
    </Card>
  );
}

BookCard.propTypes = {
  bookObj: PropTypes.shape({
    firebaseKey: PropTypes.string,
    title: PropTypes.string,
    authorID: PropTypes.string,
    coverImage: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default BookCard;
