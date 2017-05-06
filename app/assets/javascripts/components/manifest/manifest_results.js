import React from 'react'
import List from './list_result'
import Matrix from './matrix_result'

const ManifestResults = ({ results }) => {
  let manifestResults

  if (typeof results === 'string') {
    manifestResults = <span>{results}</span>
  } else {
    manifestResults = Object.keys(results).map((resultName) => {
      const result = results[resultName]
      const elementResults =  Object.keys(result).map((elementName) => {
        return (
          <div key={elementName}>
            {Result(elementName, result[elementName])}
          </div>
        )
      })

      return(
      <div key={resultName}>
        {resultName}
        {elementResults}
      </div>
    )})
  }

  return (
    <div className='manifest-results-container'>
      <div>Results</div>
        {manifestResults}
    </div>
  )
}

const isPrimitiveType = (value) => typeof value === 'string' || typeof value === 'number' || value === null || typeof value === 'undefined'

export const Result = (name, data, nestLevel = 0) => {
  if (isPrimitiveType(data)) {
    //display primitive type result
    return (
      <div style={{ marginLeft: nestLevel * 5 }}>
        <span className='label'>@{name} - </span>
        {data}
      </div>
    )
  } else if (Array.isArray(data) && data[0].label) {
    if (isPrimitiveType(data[0].value)) {
      //display a list/vector
      return (
        <div style={{marginLeft: nestLevel * 5 }}>
          <List dataList={data} name={name}/>
        </div>
      )
    } else {
      //nested objects recursively call Result on each property
      return (
        <div style={{marginLeft: nestLevel * 5 }}>
          <div className='label'>@{name}</div>
          {data.map((elem, index) => (
            <div key={index}>
              { Result(elem.label, elem.value, nestLevel + 1) }
            </div>
          ))}
        </div>
      )
    }
  } else if (data.hasOwnProperty('matrix')) {
    //display matrix
    const props = { ...data.matrix, name }
    return (
      <div style={{ marginLeft: nestLevel * 5 }}>
        <Matrix {...props} />
      </div>
    )
  } else if (data.hasOwnProperty('errors')) {
    //handle error result
    return <div>{data.errors.join(', ')}</div>
  }
}

export default ManifestResults