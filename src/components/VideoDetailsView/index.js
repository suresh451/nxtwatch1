import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import HomeSideBar from '../HomeSideBar'
import FailedView from '../FailedView'
import VideoPlay from '../VideoPlay'
import NxtWatchThemeContext from '../../context/NxtWatchThemeContext'
import {VideoDetailsContainer,VideoDetailsDiv,} from './styledComponents'



const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class VideoDetailsView extends Component {
  state = {
    videoData: [],
    apiStatus: apiStatusConstants.initial,
    isLiked: false,
    isDisLiked: false,

  }

  componentDidMount() {
    this.getVideoData()
  }

  formatedData = data => ({
    id:data.video_details.id,
    title:data.video_details.title,
    videoUrl:data.video_details.video_url,
    thumbnailUrl:data.video_details.thumbnail_url,
    viewCount:data.video_details.view_count,
    publishedAt:data.video_details.published_at,
    description:data.video_details.description,
    name:data.video_details.channel.name,
    profileImageUrl:data.video_details.channel.profile_image_url,
    subscriberCount:data.video_details.channel.subscriber_count,

  })

  getVideoData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/videos/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.formatedData(data)
      this.setState({
        videoData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

    clickLiked = () => {
        this.setState(prevState=> ({
            isLiked: !prevState.isLiked,
            isDisLiked: false,
        }))
    }

    clickDisLiked = () => {
        this.setState(prevState => ({
            isDisLiked:!prevState.isDisLiked,
            isLiked: false,
        }))
    }

  onRetry = () => {
    this.getVideoData()
  }


  renderVideoDetailsList = () => {
    const {videoData, isDisLiked, isLiked} = this.state
    
    return (
        <VideoPlay 
            videoData={videoData}
            isLiked={isLiked}
            isDisLiked={isDisLiked}
            clickLiked= {this.clickLiked}
            clickDisLiked = {this.clickDisLiked}
            clickSaved = {this.clickSaved}
        />
    )
      
  }

  renderHomeFailureView = () => <FailedView onRetry={this.onRetry}/>

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderTrendingVideosView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVideoDetailsList()
      case apiStatusConstants.failure:
        return this.renderHomeFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render () {
    return (
      <NxtWatchThemeContext.Consumer>
      {value => {
        const {isDark} = value

        const bgColor = isDark ? '#0f0f0f' : '#f9f9f9'
        
        

        return (
            <>
          <Header />
          <VideoDetailsDiv>
          <HomeSideBar />
          <VideoDetailsContainer bgColor={bgColor} data-testid="videoItemDetails">
            {this.renderTrendingVideosView()}
          </VideoDetailsContainer>
          </VideoDetailsDiv>
        </>
        )
      }}
      </NxtWatchThemeContext.Consumer>
        
    )
  }
}

export default VideoDetailsView