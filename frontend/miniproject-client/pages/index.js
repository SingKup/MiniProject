import React, { useState, useEffect } from 'react'
import axios from 'axios'
import useSWR, { mutate } from 'swr'


const URL = `http://localhost/api/students`
const fetcher = url => axios.get(url).then(res => res.data) 
export default function Home() {

  // const [students, setStudents] = useState({
  //   list: [
  //     { id: 1, name: 'Thanan', surname : 'Chairat' , major : 'CoE', GPA : 3.11 }
  //   ]
  // })

  const [student, setStudent] = useState([])
  const [name,setName] = useState('')
  const [surname,setSurname] = useState('')
  const [major,setMajor] = useState('')
  const [GPA,setGPA] = useState(0)
  
  const {data,error} = useSWR(URL,fetcher)
  if(!data)
  {
      return <div>Loading ...</div>
  }

  const addStudent = async (name,surname,major, GPA) =>{
    let students = await axios.post(URL , {name,surname,major, GPA})
    mutate(URL)
  }

  const getStudents = async () => {
    let student = await axios.get(URL)
    mutate(URL)
    
  }

  const printStudents = (students) =>{
    if( students && students.length)
    return (students.map((item, index) => 
          <li key = {index}>
            {index + 1 }:
            {(item) ? item.name : "-"}:
            {(item) ? item.surname : "-"}:
            {(item) ? item.major : "-"}:
            {(item) ? item.GPA : 0}
            <button onClick={() => getStudent(item.id)}>Get</button>
            <button onClick={() => updateStudent(item.id)}>Update</button>
            <button onClick={() => deleteStudent(item.id)}>Delete</button>
          </li>))
    else
      return (<li>No Student</li>)
  }

  const deleteStudent = async (id) => {
    let students = await axios.delete(`${URL}/${id}`)
    mutate(URL)
  }

  const updateStudent = async (id) => {
    let students = await axios.put(`${URL}/${id}`,{name,surname,major,GPA})
    mutate(URL)
  }

  const getStudent = async (id) => {
    const student = await axios.get(`${URL}/${id}`)
    setStudent({ name: student.data.name , surname: student.data.surname, major: student.data.major, GPA: student.data.GPA })
  }

  return (
    <div> Students
      <ul>{printStudents(data.list)}</ul>
      selected student: {student.name} {student.surname} {student.major} {student.GPA}
      <h2>Add student</h2>
          Name : <input type="text" onChange={(e)=>setName(e.target.value)} /> <br/>
          Surname : <input type="text" onChange={(e)=>setSurname(e.target.value)} /> <br/>
          Major : <input type="text" onChange={(e)=>setMajor(e.target.value)} /> <br/>
          GPA : <input type="number" onChange={(e)=>setGPA(e.target.value)} /> <br/>
          <button onClick={ () => addStudent(name,surname,major,GPA)}>Add New Student</button>

    </div>
  )
}
