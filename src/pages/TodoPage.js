import React, { Component } from 'react';

import axios from 'axios';

import {
    Table, Button,
    ButtonGroup
} from 'react-bootstrap';

import TodoForm from '../components/TodoForm';

class TodoPage extends Component {

    state = {
        todos: []
    }

    componentDidMount() {
        this.getTodos();
    }

    getTodos() {
        axios.get('http://localhost:3001/todos')
            .then((response) => {
                console.log(response);
                this.setState({
                    todos: response.data
                });
            }).catch((error) => {
                console.error(error);
            })
    }

    onExcluirClick = (todo) => {
        const confirm = window.confirm("Deseja excluir a tarefa '" + todo.title + "'?");

        if (confirm) {
            const url = "http://localhost:3001/todos/ " + todo.id;
            axios.delete(url)
                .then((response) => {
                    if (response.status === 200) {
                        return this.getTodos();
                    }
                }).catch((ex) => {
                    console.warn(ex);
                })
        }
    }

    renderTodo = () => {
        const todos = this.state.todos;

        const todosComponents = todos.map((todo, index) => {
            return (
                <tr>
                    <td>{todo.id}</td>
                    <td>{todo.title}</td>
                    <td>{todo.date}</td>
                    <td>{todo.completed}</td>
                    <td>
                        <ButtonGroup bsSize="small">
                            <Button bsStyle="warning">Editar</Button>
                            <Button bsStyle="danger"
                                onClick={() => this.onExcluirClick(todo)}>
                                Excluir
                            </Button>
                        </ButtonGroup>
                    </td>
                </tr>
            );
        });

        return todosComponents;
    }

    onNovaTarefaClick = () => {
        this.setState({ showForm: true })
    }

    onFormClose = () => {
        this.setState({ showForm: false })
    }

    onTodoSave = (title, description) => {
        const data = {
            title: title,
            description: description
        };

        axios.post('http://localhost:3001/todos', data)
            .then((response) => {
                if (response.status === 201) {
                    this.setState({ showForm: false });
                    return this.getTodos();
                }
            }).catch((ex) => {
                console.warn(ex);
            })
    }

    render() {

        return (
            <section>
                <h1>Página de Tarefas</h1>
                <Button bsSize="small" bsStyle="success"
                    onClick={this.onNovaTarefaClick}>
                    Nova Tarefas
                </Button>
                <Table>
                    <thead>
                        <tr>
                            <th>Cód.</th>
                            <th>Título</th>
                            <th>Data</th>
                            <th>Concluída</th>
                            <th>Opções</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTodo()}
                    </tbody>
                </Table>

                <TodoForm showForm={this.state.showForm} onClose={this.onFormClose}
                    onSave={this.onTodoSave} />
            </section>
        );
    }
}

export default TodoPage;