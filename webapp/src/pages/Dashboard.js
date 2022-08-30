import React, { useEffect, useState } from 'react';
import { deleteTodo, getTodos, postTodo, updateTodo } from '../api/todo.api';
import { useSelector, useDispatch } from 'react-redux';
import {
	setDone,
	setPage,
	setTodos,
	setTotal,
} from '../store/reducers/todo.reducer';
import {
	Card,
	Checkbox,
	Col,
	Dropdown,
	Form,
	Input,
	Modal,
	Pagination,
	Row,
	Select,
} from 'antd';
import { Navbar } from '../components/Navbar';
import { FloatingButton } from '../components/FloatingButton';
import { refreshTodos } from '../api/utils.api';
import { DeleteOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';

export const Dashboard = () => {
	const user = useSelector((state) => state.user.user);
	const todos = useSelector((state) => state.todo.todos);
	const total = useSelector((state) => state.todo.total);
	const search = useSelector((state) => state.todo.search);
	const doneFilter = useSelector((state) => state.todo.doneFilter);
	const page = useSelector((state) => state.todo.page);
	const dispatch = useDispatch();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [addingTodo, setAddingTodo] = useState(false);
	const [form] = Form.useForm();
	useEffect(() => {
		getTodos(user.accessToken, 0, '', 'all')
			.then((data) => {
				dispatch(setTodos(data.content));
				dispatch(setTotal(data.totalElements));
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const newTodo = () => {
		const modal = Modal.info({
			title: 'Add new todo',
			content: (
				<Form
					form={form}
					layout="vertical"
					name="form_in_modal"
					initialValues={{ modifier: 'public' }}
				>
					<Form.Item
						name="title"
						label="Title"
						rules={[
							{
								required: true,
								message:
									'Please input the title of the TODO item!',
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item name="description" label="Description">
						<Input type="textarea" />
					</Form.Item>
				</Form>
			),
			onOk: () => {
				setAddingTodo(true);
				form.validateFields().then((values) => {
					form.resetFields();
					postTodo(user.accessToken, {
						title: values.title,
						description: values.description,
						done: false,
					})
						.then(() => {
							refreshTodos(dispatch, user.accessToken, 0);
							setAddingTodo(false);
							modal.destroy();
						})
						.catch((err) => {
							console.log(err);
						});
				});
			},
			okText: 'Add',
			okCancel: true,
			confirmLoading: addingTodo,
			preserve: false,
		});
	};
	//RETURNS a grid with 3 columns filled with todos
	return (
		<div>
			<Navbar></Navbar>
			<div className="container">
				<Row gutter={[16, 16]} className="toolbox">
					<Col xs={24} md={12} span={12}>
                        <Input.Search
                            allowClear
							placeholder="Search"
							onSearch={(value) => {
								refreshTodos(
									dispatch,
									user.accessToken,
									0,
									value,
									doneFilter
								);
							}}
							enterButton
						/>
					</Col>
					<Col xs={24} md={12} span={12}>
						<Select
							defaultValue={doneFilter}
							onChange={(value) => {
								refreshTodos(
									dispatch,
									user.accessToken,
									0,
									search,
									value
								);
								dispatch(setDone(value));
							}}
						>
							<Select.Option value="all">All</Select.Option>
							<Select.Option value="done">Done</Select.Option>
							<Select.Option value="notDone">
								Not done
							</Select.Option>
						</Select>
					</Col>
				</Row>
				<FloatingButton onclick={newTodo} />
				<Row gutter={[16, 16]}>
					{todos.map((todo) => (
						<Col span={12} key={todo.id}>
							<Card
								hoverable
								actions={[
									<EditOutlined
										key="edit"
                                        onClick={() => {
                                            form.resetFields();
											const modal = Modal.info({
												title: 'Edit Todo',
												content: (
													<Form
														form={form}
														layout="vertical"
                                                        name={`form_in_modal_${todo.id}`} 
														initialValues={{
															modifier: 'public',
														}}
													>
														<Form.Item
															name="title"
															label="Title"
															initialValue={
																todo.title
															}
															rules={[
																{
																	required: true,
																	message:
																		'Please input the title of the TODO item!',
																},
															]}
														>
															<Input />
														</Form.Item>
														<Form.Item
															name="description"
															label="Description"
															initialValue={
																todo.description
															}
														>
															<Input type="textarea" />
														</Form.Item>
													</Form>
												),
												onOk: () => {
													setAddingTodo(true);
													form.validateFields().then(
														(values) => {
															form.resetFields();
															updateTodo(
																user.accessToken,
																{
																	id: todo.id,
																	title: values.title,
																	description:
																		values.description,
																	done: false,
																}
															)
																.then(() => {
																	refreshTodos(
																		dispatch,
																		user.accessToken,
																		page,
																		search,
																		doneFilter
																	);
																	setAddingTodo(
																		false
																	);
																	form.resetFields();
																	modal.destroy();
																})
																.catch(
																	(err) => {
																		console.log(
																			err
																		);
																	}
																);
														}
													);
												},
												okText: 'Edit',
                                                okCancel: true,
                                                onCancel: async () => {
                                                    await form.resetFields();
                                                    modal.destroy();
                                                },
												confirmLoading: addingTodo,
												preserve: false,
											});
										}}
									/>,
                                    <DeleteOutlined key="ellipsis"
                                        onClick={() => {
                                            Modal.confirm({
                                                title: 'Are you sure delete this TODO item?',
                                                onOk: () => {
                                                    deleteTodo(
                                                        user.accessToken,
                                                        todo.id
                                                    )
                                                        .then(() => {
                                                            refreshTodos(dispatch, user.accessToken, page, search, doneFilter);
                                                        }).catch((err) => {
                                                            console.log(err);
                                                        }
                                                    );
                                                }
                                            });
                                        }
                                    } />
								]}
								title={todo.title}
								extra={
									<Checkbox
										checked={todo.done}
										onChange={(e) => {
											updateTodo(user.accessToken, {
												...todo,
												done: e.target.checked,
											})
												.then(() => {
													refreshTodos(
														dispatch,
														user.accessToken,
														page,
														search,
														doneFilter
													);
												})
												.catch((err) => {
													console.log(err);
												});
										}}
									/>
								}
							>
								<p>{todo.description}</p>
							</Card>
						</Col>
					))}
				</Row>
				<Pagination
					className="paginator"
					current={page + 1}
					defaultCurrent={1}
					defaultPageSize={6}
					total={total}
					onChange={(page) => {
						getTodos(
							user.accessToken,
							page - 1,
							search,
							doneFilter
						).then((data) => {
							dispatch(setTodos(data.content));
							dispatch(setPage(page - 1));
							dispatch(setTotal(data.totalElements));
						});
					}}
				/>
			</div>
		</div>
	);
};
