import React, { useEffect } from 'react'
import { Table, Button, Card, Badge } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listUsers, deleteUser } from '../actions/userActions'
import { useNavigate, Link } from 'react-router-dom'

function UserListScreen() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userList = useSelector((state) => state.userList)
    const { loading, error, users } = userList

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const userDelete = useSelector((state) => state.userDelete)
    const { success: successDelete } = userDelete

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers())
        } else {
            navigate('/login')
        }
    }, [dispatch, navigate, successDelete, userInfo])

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            dispatch(deleteUser(id))
        }
    }

    return (
        <Card className="shadow-sm p-3 mt-4 container-fluid">
            <h2 className="text-center text-primary mb-4 fw-bold">User Management</h2>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <div className="table-responsive">
                    <Table bordered hover className="table-sm align-middle text-nowrap">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>
                                        <a
                                            href={`mailto:${user.email}`}
                                            className="text-decoration-none"
                                        >
                                            {user.email}
                                        </a>
                                    </td>
                                    <td>
                                        {user.isAdmin ? (
                                            <Badge bg="success">Admin</Badge>
                                        ) : (
                                            <Badge bg="secondary">User</Badge>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        <Link to={`/admin/user/${user._id}/edit`}>
                                            <Button
                                                variant="outline-primary"
                                                className="btn-sm me-2"
                                                size="sm"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline-danger"
                                            className="btn-sm"
                                            size="sm"
                                            onClick={() => deleteHandler(user._id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </Card>
    )
}

export default UserListScreen
