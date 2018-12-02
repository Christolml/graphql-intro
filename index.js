const express = require('express');
const app = express();

const express_graphql = require('express-graphql');
// esta funcionalidad me permite utilizar el esquema y me permite definir como van a lucir mis datos
const { buildSchema } = require('graphql');

// data
const { courses } = require('./data.json');
// console.log(courses);


const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    }

    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    }

    type Course {
        id: Int
        title: String
        author: String
        topic: String
        url: String
    }

`);


let getCourse = (args) => {
    let id = args.id;

    return courses.filter(course => {
        return course.id == id;
    })[0]
};


let getCourses = (args) => {
    if (args.topic) {
        let topic = args.topic;

        return courses.filter(course => course.topic === topic);
    } else {
        return courses;
    }
};

// voy a cambiar el topic de un curso por medio de su id
let updateCourseTopic = ({id, topic}) => {
    courses.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    })
    return courses.filter(course => course.id === id)[0];
}

// estoy definiendo propiedades a traves de funciones 
const root = {
    // message: () => "Hello world!"
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic

}

// graphiql me permite visualizar la interfaz de graphql
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(3000, () => console.log('server on port 3000'));