import React from 'react';
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};

class leftNavWithContentScrolling extends React.Component {

  constructor(props) {
    super(props);
    this.scrollToTop = this.scrollToTop.bind(this);
  }

  componentDidMount() {

    Events.scrollEvent.register('begin', function () {
    });

    Events.scrollEvent.register('end', function () {
    });

  }
  scrollToTop() {
    scroll.scrollToTop();
  }
  scrollTo() {
    scroller.scrollTo('scroll-to-element', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    })
  }
  scrollToWithContainer() {

    let goToContainer = new Promise((resolve, reject) => {

      Events.scrollEvent.register('end', () => {
        resolve();
        Events.scrollEvent.remove('end');
      });

      scroller.scrollTo('scroll-container', {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart'
      });

    });

    goToContainer.then(() =>
      scroller.scrollTo('scroll-container-second-element', {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        containerId: 'scroll-container'
      }));
  }
  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }
  render() {
    return (
      <div className="row mt-1" >
        <div className="col-12" >
          <div className="card-box" >
            <div className="d-flex" >
              <div style={{ marginTop: '100px' }}>
                <div className="testFlex">
                  <div className="col-2">
                    <nav className="navbar navbar-default navbar-fixed-top">
                      <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                          <li><Link activeClass="active" className="test1" to="Customer" spy={true} smooth={true} duration={500} >Customer</Link></li>
                          <li><Link activeClass="active" className="test2" to="Complaint" spy={true} smooth={true} duration={500}>Complaint</Link></li>
                          <li><Link activeClass="active" className="test3" to="test3" spy={true} smooth={true} duration={500} >Follow UP</Link></li>
                          <li><Link activeClass="active" className="test4" to="test4" spy={true} smooth={true} duration={500}>Appoinment</Link></li>
                          <li><Link activeClass="active" className="test5" to="test5" spy={true} smooth={true} duration={500} delay={1000}>Test 5 ( delay )</Link></li>
                          <li><Link activeClass="active" className="test6" to="anchor" spy={true} smooth={true} duration={500}>Attachments</Link></li>
                          <li> <a onClick={() => scroll.scrollTo(100)}>Scroll To 100!</a></li>
                          <li> <a onClick={() => scroll.scrollToBottom()}>Scroll To Bottom</a></li>
                          <li> <a onClick={() => scroll.scrollMore(500)}>Scroll 500 More!</a></li>
                          <li> <a onClick={() => scroll.scrollMore(1000, { delay: 1500 })}>Scroll 1000 More! ( delay ) </a></li>
                          <li><Link activeClass="active" className="test8" to="same" spy={true} smooth={true} duration={500}>Same target</Link></li>
                          <li><Link activeClass="active" className="test9" to="same" spy={true} smooth={true} duration={500}>Same target</Link></li>
                          <li><a className="test1" to="test1" onClick={() => this.scrollTo()} >Scroll to element</a></li>
                          <li><a className="test1" to="test1" onClick={() => this.scrollToWithContainer()} >Scroll to element within container</a></li>
                        </ul>
                      </div>
                    </nav>
                  </div>
                  <div className="new-customer col-8 p-0">
                    <Element name="Customer" className="element" >
                      Customer
                    </Element>

                    <Element name="Complaint" className="element">
                      Complaint
                    </Element>

                    <Element name="test3" className="element">
                      Follow UP
                    </Element>

                    <Element name="test4" className="element">
                      Appoinment
                    </Element>

                    <Element name="test5" className="element">
                      test 5
                    </Element>

                    <div id="anchor" className="element">
                      test 6 (anchor)
                    </div>

                    <Link activeClass="active" to="firstInsideContainer" spy={true} smooth={true} duration={250} containerId="containerElement" style={{ display: 'inline-block', margin: '20px' }}>
                      Go to first element inside container
                    </Link>

                    <Link activeClass="active" to="secondInsideContainer" spy={true} smooth={true} duration={250} containerId="containerElement" style={{ display: 'inline-block', margin: '20px' }}>
                      Go to second element inside container
                    </Link>

                    <Element name="test7" className="element" id="containerElement" style={{
                      position: 'relative',
                      height: '200px',
                      overflow: 'scroll',
                      marginBottom: '100px'
                    }}>

                      <Element name="firstInsideContainer" style={{
                        marginBottom: '200px'
                      }}>
                        first element inside container
                      </Element>

                      <Element name="secondInsideContainer" style={{
                        marginBottom: '200px'
                      }}>
                        second element inside container
                      </Element>
                    </Element>


                    <Element id="same" className="element">
                      Two links point to this
                    </Element>


                    <Element name="scroll-to-element" className="element">
                      Scroll to element
                    </Element>

                    <Element className="element" id="scroll-container" style={{
                      position: 'relative',
                      height: '200px',
                      overflow: 'scroll',
                      marginBottom: '100px'
                    }}>

                      <Element name="scroll-container-first-element" style={{
                        marginBottom: '200px'
                      }}>
                        first element inside container
                      </Element>

                      <Element name="scroll-container-second-element" style={{
                        marginBottom: '200px'
                      }}>
                        second element inside container
                      </Element>
                    </Element>

                    <a onClick={this.scrollToTop}>To the top!</a>
                  </div>
                </div>
              </div >
            </div >
          </div >
        </div >
      </div >
    );
  }
};

export default leftNavWithContentScrolling;