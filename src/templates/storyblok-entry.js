import React from 'react'
import Components from '../components/components.js'
import Navi from '../components/navi.js'

class StoryblokEntry extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (state.story.uuid === props.pageContext.story.uuid) {
      return null
    }

    return StoryblokEntry.prepareStory(props)
  }

  static prepareStory(props) {
    const story = Object.assign({}, props.pageContext.story)
    const globalSettings = Object.assign({}, props.pageContext.globalSettings)
    story.content = JSON.parse(story.content)
    globalSettings.content = JSON.parse(globalSettings.content)
    
    return { story, globalSettings }
  }

  constructor(props) {
    super(props)

    this.state = StoryblokEntry.prepareStory(props)
  }

  render() {
    let content = this.state.story.content
    let globalSettings = this.state.globalSettings.content

    return (
      <div>
        <Navi blok={globalSettings}></Navi>
        {React.createElement(Components[content.component], {key: content._uid, blok: content})}
      </div>
    )
  }
}

export default StoryblokEntry
