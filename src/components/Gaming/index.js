import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {SiYoutubegaming} from 'react-icons/si'
import Header from '../Header'
import HomeSideBar from '../HomeSideBar'
import FailedView from '../FailedView'
import GameItem from '../GameItem'
import NxtWatchThemeContext from '../../context/NxtWatchThemeContext'
import {GamingContainer,GamingDiv,UlList,} from './styledComponents'



const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Gaming extends Component {
  state = {
    gameVideos: [],
    apiStatus: apiStatusConstants.initial,

  }

  componentDidMount() {
    this.getGameVideos()
  }

  getGameVideos = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/videos/gaming`
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
      const updatedData = fetchedData.videos.map(game => ({
        title: game.title,
        id: game.id,
        thumbnailUrl: game.thumbnail_url,
        viewCount:game.view_count,
      }))
      this.setState({
        gameVideos: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }


  onRetry = () => {
    this.getGameVideos()
  }


  renderGameVideosList = () => {
    const {gameVideos} = this.state
    const noVideos = gameVideos.length === 0

    return noVideos ? (<div>
                <img src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png" alt="no videos" />
                <h1>No Search Results Found</h1>
                <p>Try different key words or remove search results</p>
                <button type="button">
                    Retry
                </button>
            </div>) : (<UlList className="ul-list">
            {gameVideos.map(eachGame => (
        <GameItem gameDetails={eachGame} key={eachGame.id} />
      ))}
            </UlList>)
      
  }

  renderHomeFailureView = () => <FailedView onRetry={this.onRetry}/>

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderGamingVideosView = () => {
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
            <>
          <Header />
          <GamingDiv>
          <HomeSideBar />
          <GamingContainer bgColor={bgColor} data-testid="gaming">
            <div>
              <div>
                <SiYoutubegaming size={40}/>
              </div>
              <h1>Gaming</h1>
            </div>
            {this.renderGamingVideosView()}
          </GamingContainer>
          </GamingDiv>
        </>
        )
      }}
      </NxtWatchThemeContext.Consumer>
        
    )
  }
}

export default Gaming