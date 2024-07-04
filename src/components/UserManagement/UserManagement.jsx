import React, { useEffect, useState } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import './UserManagement.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '../utils/Auth';
//change 
import Modal from 'react-modal';
Modal.setAppElement('#root');
//change

export default function UserManagement() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    //change
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRowData, setCurrentRowData] = useState({ username: '', email: '', role: '' });
    //change

    //change
    const openModal = (row) => {
        setCurrentRowData(row);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name);
        console.log(value);
        console.log(e.target);
        setCurrentRowData({ ...currentRowData, [name]: value });
        console.log(setCurrentRowData({ ...currentRowData, [name]: value }))
    };

    const handleSave = async (event) => {
        event.preventDefault();
        console.log(currentRowData);
        if(currentRowData.email === '' || currentRowData.username === '' || currentRowData.role === ''){
            console.log("Email,UserName and Role cannot be empty");
            return;
        }
        try{
            const response = await fetch('http://localhost:8000/edit_users',{
                method : 'PUT',
                headers : {
                    'content-type' : 'application/json'
                },
                body : JSON.stringify(currentRowData),
                

            });
            if(!response){
                console.log('Network response not ok');
                return;
            }
            const data = await response.json();
            console.log(data.detail);
            window.location.reload();

        } catch (error){
            console.log('Invalid Credetials')
        }
        closeModal();
    }
    //change

    useEffect(() => {
        async function loadData() {
            try {
                const users = await fetchUsers();
                console.log(users);
                console.log(users.length);
                for (let i = 0; i < users.length; i++) {
                    console.log("entered");
                    console.log(users[i]);
                }
                setData(users);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const columns = React.useMemo(
        () => [
            { Header: 'Name', accessor: 'username' },
            { Header: 'Email', accessor: 'email' },
            { Header: 'Role', accessor: 'role' },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <>
                        {/* change */}
                        <button onClick={() => openModal(row.original)}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        {/* change */}
                        <button onClick={() => handleDelete(row.original.email)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </>
                   
                )
            },
        ],
        []
    );

    const handleDelete = async (email) => {
        console.log(email)
        const confirmed = window.confirm(`Are you sure you want to delete this user?`);
        if(!confirmed){
            return;
        }
        try {
             const response = await fetch('http://localhost:8000/user_delete',{
                method : 'POST',
                headers : {
                    'content-type' : 'application/json'
                },
                body : JSON.stringify({email})
             }); 
             console.log(response);

            if (!response) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            // Reload the page
            window.location.reload();
            return data.detail;
            
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    };

    const { getTableProps,getTableBodyProps, headerGroups, prepareRow,page,canPreviousPage,
        canNextPage,pageOptions, state: { pageIndex, globalFilter }, setGlobalFilter,nextPage, previousPage,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        useGlobalFilter,
        usePagination
    );

    if (loading) {
        return (
            <div className="spinner-overlay">
                <i className="fas fa-spinner fa-spin fa-3x"></i>
            </div>
        );
    }

    return (
        <div className='user-management'>
            <button onClick={() => navigate('/Home')} className="back-button">Back</button>
            <input
                value={globalFilter || ""}
                onChange={e => setGlobalFilter(e.target.value || undefined)}
                placeholder="Search..."
                className="search-input"
            />
            <table {...getTableProps()} className="table">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    Previous
                </button>
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>
                </span>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    Next
                </button>
            </div>
            {/* change */}
            <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Edit User"
                className="modal-popup" overlayClassName="overlay">
                <h2>Edit User</h2>
                <form>
                <div className="input-box">
                    {/* <label> Name:</label> */}
                    <input type="text" name="username" value={currentRowData.username}
                         onChange={handleInputChange}/>
                </div>
                <div className="input-box">
                    {/* <label> Email: </label> */}
                    <input type="email"name="email" value={currentRowData.email} 
                        onChange={handleInputChange} disabled />
                </div>
                <div className="input-box">
                    {/* <label> Role:</label> */}
                    <input type="text" name="role" value={currentRowData.role} 
                        onChange={handleInputChange}/>
                </div>
                    <button type="button" onClick={handleSave}>Save</button>
                    <button type="button" onClick={closeModal}>Cancel</button>
                </form>
            </Modal>
        </div>
    );
}
