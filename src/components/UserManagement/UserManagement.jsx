import React, { useEffect, useState } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import './UserManagement.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { fetchUsers,deleteUser } from '../utils/Auth';

export default function UserManagement() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadData() {
            try {
                const users = await fetchUsers();
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
            // { Header: 'ID', accessor: 'id' },
            { Header: 'Name', accessor: 'name' },
            { Header: 'Email', accessor: 'email' },
            { Header: 'Role', accessor: 'role' },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <button onClick={() => handleDelete(row.original.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                )
            },
        ],
        []
    );

    const handleDelete = async (userId) => {
        try {
            await deleteUser(userId); 
            setData(data.filter(user => user.id !== userId)); 
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    };

    const {
        getTableProps,getTableBodyProps,headerGroups,prepareRow,page,
        canPreviousPage,canNextPage,pageOptions, state: { pageIndex, globalFilter },
        setGlobalFilter, nextPage, previousPage,
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
        return <div className="spinner-overlay">
                <i className="fas fa-spinner fa-spin fa-3x"></i>
            </div>;
    }

    return (
        <div className='user-management'>
            <button onClick={() => navigate('/Home')} className="back-button">Back</button>
            {/* <h1>User Management</h1> */}
            {/* <button onClick={() => navigate('/Home')} className="back-button">Back</button> */}
            <input
                value={globalFilter || ""}
                onChange={e => setGlobalFilter(e.target.value || undefined)}
                placeholder="Search..."
                className="search-input"
            />
            {/* <div className="table-container"> */}
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
            {/* </div> */}
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
        </div>
    );
}
