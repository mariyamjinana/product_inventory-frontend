import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faSquarePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { addProductApi, getProductApi, removeProduct, updateProductApi } from '../services/Allapi';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Home() {
    const [show, setShow] = useState(false);
    const [product, setProduct] = useState([]);
    const [productDetails, setProductDetails] = useState({
        name: '',
        category: '',
        price: '',
        quantity: '',
        description: ''
    });
    const [editProductId, setEditProductId] = useState(null); // Track the id of the product to be updated

    // Handle modal visibility
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setProductDetails({
            name: '',
            category: '',
            price: '',
            quantity: '',
            description: ''
        }); // Reset the form for adding a new product
        setEditProductId(null); // Clear edit mode when opening the modal
        setShow(true);
    };

    // Handle adding a new product
    const handleAdd = async () => {
        const { name, category, price, quantity, description } = productDetails;
        const result = await addProductApi({ name, category, price, quantity, description });
        if (result.status >= 200 && result.status < 300) {
            alert('Product added successfully');
            setShow(false);
            getAllProduct();
        }
    };

    // Fetch all products
    const getAllProduct = async () => {
        const result = await getProductApi();
        setProduct(result.data);
    };

    // Handle deleting a product
    const handleDelete = async (id) => {
        const result = await removeProduct(id);
        if (result.status >= 200 && result.status < 300) {
            alert('Product deleted successfully');
            getAllProduct();
        }
    };

    // Handle updating a product
    const handleUpdate = async () => {
        const { name, category, price, quantity, description } = productDetails;
        const result = await updateProductApi(editProductId, { name, category, price, quantity, description });
        if (result.status >= 200 && result.status < 300) {
            alert('Product updated successfully');
            setShow(false);
            getAllProduct();
        }
    };

    // Fill the form with product data when editing
    const handleEdit = (product) => {
        setProductDetails({
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: product.quantity,
            description: product.description
        });
        setEditProductId(product.id); // Set the id of the product to be edited
        setShow(true); // Open the modal
    };

    useEffect(() => {
        getAllProduct();
    }, []);

    return (
        <>
            <div className="mt-3 p-5">
                <button type="button" className="btn tex-primary" onClick={handleShow}>
                    <h4 className="text-primary">
                        <FontAwesomeIcon icon={faSquarePlus} /> Add Product
                    </h4>
                </button>
            </div>

            <h1 className="text-center mt-3">Products</h1>

            {product?.length > 0 ? (
                <div className="d-flex justify-content-center align-items-center">
                    <table className="border border-1 p-5 text-center shadow mt-3">
                        <thead className="border border-2">
                            <tr>
                                <th scope="col" className="p-4">Name</th>
                                <th scope="col" className="p-4">Category</th>
                                <th scope="col" className="p-4">Price</th>
                                <th scope="col" className="p-4">Stock</th>
                                <th scope="col" className="p-4">Description</th>
                                <th scope="col" className="p-4"></th>
                                <th scope="col" className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {product?.map((item) => (
                                <tr key={item.id}>
                                    <td className="p-4">{item.name}</td>
                                    <td className="p-4">{item.category}</td>
                                    <td className="p-4">{item.price}</td>
                                    <td className="p-4">{item.quantity}</td>
                                    <td className="p-4">{item.description}</td>
                                    <td className="p-4 text-center">
                                        <button
                                            type="button"
                                            className="bg-danger border border-0"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} style={{ color: 'white' }} />
                                        </button>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={() => handleEdit(item)}
                                        >
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <h2>No products added...</h2>
            )}

            {/* Modal for adding/updating product */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editProductId ? 'Update Product' : 'Add Product'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-center align-items-center mt-3">
                        <form className="bg-warning p-5">
                            <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="Product Name"
                                onChange={(e) => setProductDetails({ ...productDetails, name: e.target.value })}
                                value={productDetails.name}
                            />
                            <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="Category"
                                onChange={(e) => setProductDetails({ ...productDetails, category: e.target.value })}
                                value={productDetails.category}
                            />
                            <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="Price"
                                onChange={(e) => setProductDetails({ ...productDetails, price: e.target.value })}
                                value={productDetails.price}
                            />
                            <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="Quantity"
                                onChange={(e) => setProductDetails({ ...productDetails, quantity: e.target.value })}
                                value={productDetails.quantity}
                            />
                            <textarea
                                className="form-control mt-2"
                                placeholder="Description"
                                onChange={(e) => setProductDetails({ ...productDetails, description: e.target.value })}
                                value={productDetails.description}
                            />
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        type="button"
                        onClick={editProductId ? handleUpdate : handleAdd}
                    >
                        {editProductId ? 'Update' : 'Add'} Product
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Home;