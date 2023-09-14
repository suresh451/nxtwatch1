import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {HiFire} from 'react-icons/hi'
import Header from '../Header'
import HomeSideBar from '../HomeSideBar'
import FailedView from '../FailedView'
import TrendingItem from '../TrendingItem'
import NxtWatchThemeContext from '../../context/NxtWatchThemeContext'
import {TrendingContainer,TrendingDiv,} from './styledComponents'



const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Trending extends Component {
  state = {
    trendingVideos: [],
    apiStatus: apiStatusConstants.initial,

  }

  componentDidMount() {
    this.getTrendingVideos()
  }

  getTrendingVideos = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/videos/trending`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = fetchedData.videos.map(trending => ({
        title: trending.title,
        id: trending.id,
        thumbnailUrl: trending.thumbnail_url,
        viewCount:trending.view_count,
        publishedAt:trending.published_at,
        profileImgUrl: trending.channel.profile_image_url,
        name: trending.channel.name,
      }))
      this.setState({
        trendingVideos: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }


  onRetry = () => {
    this.getTrendingVideos()
  }


  renderGameVideosList = () => {
    const {trendingVideos} = this.state
    const noVideos = trendingVideos.length === 0

    return noVideos ? (<div>
                <img src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png" alt="no videos" />
                <h1>No Search Results Found</h1>
                <p>Try different key words or remove search results</p>
                <button type="button">
                    Retry
                </button>
            </div>) : (<ul className="ul-list">
            {trendingVideos.map(eachTrending => (
        <TrendingItem trendingDetails={eachTrending} key={eachTrending.id} />
      ))}
            </ul>)
      
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
        return this.renderGameVideosList()
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
            <div data-testid="trending">
          <Header />
          <TrendingDiv>
          <HomeSideBar />
          <TrendingContainer bgColor={bgColor} data-testid="trending">
            <div>
              <div>
                <HiFire size={40}/>
              </div>
              <h1>Trending</h1>
            </div>
            {this.renderTrendingVideosView()}
          </TrendingContainer>
          </TrendingDiv>
        </div>
        )
      }}
      </NxtWatchThemeContext.Consumer>
        
    )
  }
}

export default Trending