import React, { Component } from 'react';
import hemburger from '../assets/images/hemburger-icon.png';
import bell from '../assets/images/bell-icon.png';
import logo from '../assets/images/logo.png';
import cate_icon from '../assets/images/cate-icon1.png';
import cate_icon2 from '../assets/images/cate-icon2.png';
import cate_icon3 from '../assets/images/cate-icon3.png';
import expert_img from '../assets/images/expert-img1.png';
import axios from '../Helper/Instance';
import sidemenu from '../Helper/Sidemenu';
import Search_doctor from '../Component/User/Search_doctor';
import { toast } from 'react-toastify';
import Sidebar from '../Component/Sidebar';
import { browserHistory } from 'react-router';
import { NavLink } from 'react-router-dom';
import View_doctor from '../Component/Member/View_doctor';
import queryString from 'query-string';
import Loader from '../Component/Loader/Loader';
import Pagination from 'react-responsive-pagination';
import { Unreadnotification } from '../Helper/ProfileApi';
import { isIOSDevice } from '../Helper/Device_detect';
import noimage from '../assets/images/download.png';
// import { Offline, Online } from "react-detect-offline";
const WAIT_INTERVAL = 2000;
const ENTER_KEY = 13;
export default class Home_page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_post: [],
      postperpage: 5,
      currentPage: 1,
      totalpostnumber: '',
      category: 'Normal',
      search: '',
      catval: '',
      loading: true,
      unread: '',
      cateval: '',
      loadingpage: false,
      route: false,
      online: true,
      isdoctor: false,
    };
    this.token = localStorage.getItem('token');
    let params = new URL(document.location).searchParams;
    if (params.has('token') && params.has('roletype')) {
      this.web_token = params.get('token');
      this.roletype = params.get('roletype');
      localStorage.setItem('webtoken', this.web_token);
      localStorage.setItem('webrole', this.roletype);
    }
    this.timer = null;
  }

  handleChange = (e) => {
    clearTimeout(this.timer);
    this.setState({ search: e.target.value });
    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
  };

  handleKeyDown = (e) => {
    if (e.keyCode === ENTER_KEY) {
      clearTimeout(this.timer);
      this.triggerChange();
    }
  };

  triggerChange = () => {
    const { search } = this.state;
    let regex = /^[^.\s]+(\s+[^\s]+)*/g;
    if (regex.test(search)) {
      this.setState(
        {
          category: 'Searchlist',
          search: this.state.search,
        },
        () => {
          this.receivedData(this.state.currentPage);
        }
      );
    }
  };

  async componentDidMount() {
    sidemenu();
    this.receivedData(this.state.currentPage);
    let unread_message = await Unreadnotification();
    if (unread_message !== undefined) {
      let total_count = unread_message.Announcement_Event;
      await this.setState({
        unread: total_count,
      });
    }
    setInterval(async () => {
      let unread_message = await Unreadnotification();
      if (unread_message !== undefined) {
        let total_count = unread_message.Announcement_Event;
        await this.setState({
          unread: total_count,
        });
      }
    }, 30000);
    axios
      .get('/api/wp-json/ca/v1/getCategoryList')
      .then((res) => {
        let data = res.data.data;
        data.forEach(function (element) {
          element.checked = true;
        });
        this.setState({
          categorylist: data.reverse(),
        });
        localStorage.setItem('categorylist', JSON.stringify(data));
      })
      .catch((error) => {
        if (!error.response) {
          this.setState({
            loading: false,
            loadingpage: true,
          });
        } else {
          toast.error(error.response.data.message);
        }
      });
  }

  componentDidUpdate(prevProps, prevStates) {
    if (prevStates.unread !== this.state.unread) {
      this.setState({
        unread: this.state.unread,
      });
    }
  }

  receivedData = async (page) => {
    var config = {};
    if (this.token !== null) {
      var config = {
        Authorization: `Bearer ${this.token}`,
      };
    } else if (this.web_token !== undefined) {
      var config = {
        Authorization: `Bearer ${this.web_token}`,
      };
    }
    if (this.state.category === 'Normal') {
      try {
        this.setState({ loading: true });
        let All_data = await axios.post('/api/ca/v1/getMemberDetails', null, {
          params: {
            page: page,
            per_page: this.state.postperpage,
          },
          headers: config,
        });
        let Rawdata = All_data.data.data;
        localStorage.setItem('offline', JSON.stringify(Rawdata));
        localStorage.setItem('totalpost', All_data.data.total_users);
        this.setState({
          totalpostnumber: All_data.data.total_users,
          total_post: Rawdata,
          currentPage: page,
          loading: false,
          loadingpage: true,
        });
      } catch (error) {
        if (!error.response) {
          let offlinedata = JSON.parse(localStorage.getItem('offline'));
          let postnumber = localStorage.getItem('totalpost');
          this.setState({
            totalpostnumber: postnumber,
            total_post: offlinedata,
            currentPage: 1,
            loading: false,
            loadingpage: true,
          });
        } else {
          toast.error(error.response.data.message);
        }
      }
    } else if (this.state.category === 'Searchlist') {
      try {
        this.setState({
          loading: true,
          loadingpage: false,
        });
        let All_data = await axios.post('/ca/v1/getMemberDetails', null, {
          params: {
            search: this.state.search,
            page: page,
            per_page: this.state.postperpage,
          },
          headers: config,
        });
        let Raw_data_search = All_data.data.data;
        this.setState({
          totalpostnumber: All_data.data.total_users,
          total_post: Raw_data_search,
          currentPage: 1,
          loading: false,
          loadingpage: true,
        });
      } catch (error) {
        if (!error.response) {
          this.setState({
            loading: false,
            loadingpage: true,
          });
        } else {
          toast.error(error.response.data.message);
        }
      }
    }
  };

  getCategory = (cat) => {
    this.setState({
      route: true,
      cateval: cat,
    });
  };

  // remove filter for search only....
  removefilter = () => {
    this.setState(
      {
        category: 'Normal',
      },
      () => {
        this.receivedData(this.state.currentPage);
      }
    );
  };

  removeCategory = () => {
    this.setState({
      route: false,
    });
  };

  getDetail = (id) => {
    this.setState({
      docindex: id,
      isdoctor: true,
    });
  };

  removetocategory = () => {
    this.setState({
      isdoctor: false,
    });
  };

  render() {
    sidemenu();
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
    };
    let totalpage = Math.ceil(
      this.state.totalpostnumber / this.state.postperpage
    );
    const { categorylist } = this.state;
    let container = {
      height: '50px',
      width: '50px',
      display: 'inline-block',
      margin: '5px',
      backgroundColor: 'gray',
    };

    return (
      <div>
        {this.state.route ? (
          <Search_doctor
            categoryvalue={{
              category: this.state.cateval,
              func: this.removeCategory,
            }}
          />
        ) : this.state.isdoctor ? (
          <View_doctor
            Id={{ index: this.state.docindex, newfunc: this.removetocategory }}
          />
        ) : (
          <div>
            <Sidebar />
            <div className="header">
              <div className="container-fluid">
                <div className="inner-con">
                  {!isIOSDevice() && (
                    <div className="hemburger-menu">
                      <a href="#" id="menuBtn">
                        <img src={hemburger} alt="Hemburger" />
                      </a>
                    </div>
                  )}
                  <a href="#" className="applogo">
                    <img src={logo} height="40px" alt="" />
                  </a>
                  <div className="bell">
                    <NavLink to="/notification">
                      <img src={bell} alt="Bell" />
                      <sup className="badge">
                        {this.state.unread !== 0 && this.state.unread}
                      </sup>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
            <section className="main-section">
              <div className="search-form">
                <div className="container-fluid">
                  <h1>
                    Find Your Mental
                    <br />
                    Health Professional
                  </h1>

                  <div className="form">
                    <input
                      type="text"
                      className="searchInput"
                      onChange={this.handleChange}
                      onKeyDown={this.handleKeyDown}
                      value={this.state.search}
                      placeholder="Search Name, City or Zip"
                    />
                  </div>
                </div>
              </div>
              <div className="content-section">
                <div className="container-fluid">
                  <h2>Categories</h2>
                  <div className="category-list">
                    <ul>
                      {!this.state.loading &&
                        categorylist &&
                        categorylist.map((val, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              this.getCategory(val);
                            }}
                          >
                            <figure>
                              <img src={val.image_url} alt={val.label} />
                            </figure>
                            <figcaption>{val.label}</figcaption>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <h2 className="flexbox">
                    Mental Health Professional
                    <a href="#!" onClick={this.removefilter}>
                      Show All
                    </a>
                  </h2>
                  {this.state.online ? (
                    this.state.loading ? (
                      <Loader />
                    ) : (
                      <div className="expert-category-list">
                        <ul>
                          {this.state.total_post != '' ? (
                            this.state.total_post.map((val, index) => (
                              <li
                                key={index}
                                onClick={() => {
                                  this.getDetail(val.user_data.ID);
                                }}
                              >
                                <figure>
                                  {val.image_url != '' ? (
                                    <img
                                      src={val.image_url}
                                      alt={val.category_name}
                                    />
                                  ) : (
                                    <img src={noimage} alt="any name" />
                                  )}
                                </figure>
                                <div className="caption">
                                  <h3>
                                    {val.user_other_info.first_name[0]}{' '}
                                    {val.user_other_info.last_name[0]}
                                    <span></span>
                                  </h3>
                                  <h4>
                                    {Array.isArray(val.category_name.data)
                                      ? val.category_name.data != ''
                                        ? val.category_name.data.map(
                                            (value, ind) =>
                                              value.label === 'Other' ? (
                                                val.user_other_info
                                                  .custom_category[0]
                                              ) : ind == 0 ? (
                                                <span key={ind}>
                                                  {value.label}
                                                </span>
                                              ) : (
                                                <span key={ind}>
                                                  , {value.label}
                                                </span>
                                              )
                                          )
                                        : 'Not Defined'
                                      : 'Not Defined'}
                                  </h4>
                                  <p>
                                    {val.user_other_info.user_address[0]},{' '}
                                    {val.user_other_info.user_country[0]}{' '}
                                    {val.user_other_info.user_zip_code[0]}
                                  </p>
                                </div>
                              </li>
                            ))
                          ) : (
                            <li className="center">Data not found....</li>
                          )}
                        </ul>
                      </div>
                    )
                  ) : (
                    <div className="center">Data Not Found......</div>
                  )}
                  {this.state.loadingpage && this.state.total_post != '' && (
                    <Pagination
                      current={this.state.currentPage}
                      total={totalpage}
                      onPageChange={(page) => {
                        this.receivedData(page);
                      }}
                    />
                  )}
                </div>
              </div>
            </section>
            <div></div>
          </div>
        )}
      </div>
    );
  }
}
