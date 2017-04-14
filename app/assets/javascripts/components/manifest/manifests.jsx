import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getManifests, toggleManifestsFilter, selectManifest, saveNewManifest, deleteManifest, toggleEdit, saveManifest, copyManifest, submitManifest, fetchManifestResults } from '../../actions/manifest_actions'
import Manifest from './manifest'
import VisibleManifests from './visible_manifests'
import ManifestAccess from './manifest_access'

class Manifests extends Component {
  componentDidMount() {
    this.props.getManifests()
  }

  render() {
    const { selectedManifest } = this.props

    return (
      <div>
      { (selectedManifest || this.props.isEditing) ?
        <Manifest
          editing={this.props.isEditing}
          allManifests={() => this.props.selectManifest(null)}
          manifestId={selectedManifest}
          saveNewManifest={this.props.saveNewManifest}
          manifest={this.props.manifest}
          delete={() => this.props.deleteManifest(selectedManifest)}
          edit={this.props.toggleEdit}
          updateManifest={this.props.saveManifest}
          copy={this.props.copyManifest}
          submitManifest={this.props.submitManifest}
          fetchResults={this.props.fetchManifestResults}/> :
        <div className='manifests-container'>
          <ManifestAccess
            label='Filter:'
            handleSelect={this.props.toggleManifestsFilter}
            selectedDefault={this.props.filter} />
          <VisibleManifests 
            visibleManifests={this.props.visibleManifests}
            handleClick={this.props.selectManifest}
            newManifest={this.props.toggleEdit}/>
        </div>
      }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { manifests, manifestsUI: { filter, selected, isEditing } } = state
  //filter by access 'public' or 'private'
  const filteredManifests = Object.keys(manifests).reduce((acc, id) => {
    if (!filter || manifests[id].access === filter) {
      return [ ...acc, manifests[id] ]
    }
    return acc
  }, [])
  //sort by updated_at
  const visibleManifests = filteredManifests.sort((a, b) => {
    if (a.updated_at > b.updated_at) {
      return -1
    }
    if (a.updated_at < b.updated_at) {
      return 1;
    }
    return 0
  })
  
  return {
    visibleManifests,
    filter,
    selectedManifest: selected,
    manifest: manifests[selected],
    isEditing
  }
}

export default connect(mapStateToProps, {
  getManifests,
  toggleManifestsFilter,
  selectManifest,
  saveNewManifest,
  deleteManifest,
  toggleEdit,
  saveManifest,
  copyManifest,
  submitManifest,
  fetchManifestResults
})(Manifests)