import React,{useEffect,useState} from 'react';
import Modal from "./ExitPageModal.js"
import {Redirect } from "react-router-dom"

function ExitPage(props){

  const username = localStorage.getItem("username");
 var [totalCount,setCount] = useState(0);
 var [isLoading,setLoading] = useState(true);
 useEffect(() => {
    if (totalCount===0) {
      let ignore = false;
      const controller = new AbortController();

      async function fetchUserCount() {
        let responseBody = {};
        try {
          const response = await fetch(
            `/api/votes/count/${username}`,
            { signal: controller.signal }
          );
          responseBody = await response.json();

        } catch (e) {
          if (e instanceof DOMException) {
            console.log("== HTTP request aborted");
          } else {
            console.log(e);
          }
        }

        if (!ignore) {
          setLoading(false);
          setCount(responseBody)
          sessionStorage.setItem("sessionVoteCount", "0");
          localStorage.setItem("username","");
          // props.onLogout("");

        }
      }

      fetchUserCount()
      return () => {
        controller.abort();
        ignore = true;
      };
    }
  }, [ totalCount,username ]);

  if(!username){
    return <Redirect to="/login" />
  }

  return (
        <div id="GoodbyePage">
        {isLoading && <div class="spinner"><div class="dot1"></div><div class="dot2"></div></div> }
        {!isLoading && <Modal setGlobalUsername={props.setGlobalUsername}   bannerExit={props.bannerExit}
          setBannerExit={props.setBannerExit} totalCount={totalCount}/>}
        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 123 94.09">
        <defs>
         <mask id="squiggle-mask" maskunits="userSpaceOnUse"
                    maskcontentunits="userSpaceOnUse">
           <path id="squiggle-mask-path" className="cls-5 mask" d="M56.26,90.4c-.7-3,10.21-7,10.4-11.46.63-3.89-11.14-7.69-9.57-11.62C59.22,62,67.43,60.8,66.86,55.4s-10-6.59-9.48-10.63c.3-2.59,5.8-5.38,9-8.33a5.79,5.79,0,0,0,1.91-3.54" transform="translate(-2.7 -2.61)"/>
          </mask>

          <mask id="left-line-mask" maskunits="userSpaceOnUse" maskcontentunits="userSpaceOnUse">
            <path id="left-line-mask-path" className="cls-6 mask" d="M25.78,62.5s18.38,14.73,15.9,30.91" transform="translate(-2.7 -2.61)"/>
          </mask>

          <mask id="right-line-mask" maskunits="userSpaceOnUse" maskcontentunits="userSpaceOnUse">
            <path id="right-line-mask-path" className="cls-6 mask" d="M95.12,64.5S78.32,73.83,76.8,94.2" transform="translate(-2.7 -2.61)"/>
          </mask>
        </defs>
        <path id="blue-star" className="cls-1" d="M33.3,51.8a2,2,0,0,0,2-.7l3-3.9,4.9.3a2.38,2.38,0,0,0,1.2-.3,1.34,1.34,0,0,0,.6-.7,2,2,0,0,0-.1-2.1l-2.8-4,1.8-4.6a2,2,0,0,0-.4-2.1,1.92,1.92,0,0,0-2-.6l-4.7,1.4L33,31.3a2,2,0,0,0-2.1-.3,2.15,2.15,0,0,0-1.2,1.8l-.1,4.9-4.1,2.7h0a2,2,0,0,0-.9,1.9A2.1,2.1,0,0,0,25.9,44l4.6,1.6,1.3,4.7A2.07,2.07,0,0,0,33.3,51.8Z" transform="translate(-2.7 -2.61)"/>
        <path id="yellow-star" className="cls-2" d="M91,32.9l-1.7-4.6A2.1,2.1,0,0,0,87.6,27a2,2,0,0,0-1.9.9L83.2,32l-4.9.2h0a2,2,0,0,0-1.7,1.2,2,2,0,0,0,.3,2.1L80,39.3,78.7,44a1.92,1.92,0,0,0,.6,2,2,2,0,0,0,2.1.4L86,44.6l4.1,2.7a1.8,1.8,0,0,0,1.2.3,1.61,1.61,0,0,0,.9-.3,1.89,1.89,0,0,0,1-1.9l-.3-4.9,3.9-3a1.91,1.91,0,0,0,.7-2A2.07,2.07,0,0,0,96,34Z" transform="translate(-2.7 -2.61)"/>
        <path id="yellow-burst" className="cls-2" d="M16.1,83.8a2,2,0,0,0,2.5-1.4l.7-2.4,1.8,1.8A2,2,0,1,0,24,79.1l-1.8-1.8,2.5-.6a2,2,0,1,0-.9-3.9l-2.5.6L22,71a2,2,0,1,0-3.9-1.1l-.7,2.4-1.8-1.8a2,2,0,0,0-2.9,2.7L14.5,75l-2.5.6a2,2,0,0,0,.9,3.9l2.5-.6-.7,2.4A2,2,0,0,0,16.1,83.8Z" transform="translate(-2.7 -2.61)"/>
        <path id="red-burst" className="cls-3" d="M108.8,67.4a2,2,0,0,0-2.5,1.4l-.7,2.4-1.8-1.8a2,2,0,1,0-2.9,2.7l1.8,1.8-2.5.6a2,2,0,0,0,.9,3.9l2.5-.6-.7,2.4a2,2,0,0,0,3.9,1.1l.7-2.4,1.8,1.8a2,2,0,1,0,2.9-2.7l-1.8-1.8,2.5-.6a2,2,0,1,0-.9-3.9l-2.5.6.7-2.4A2.17,2.17,0,0,0,108.8,67.4Z" transform="translate(-2.7 -2.61)"/>
        <path id="mint-burst" className="cls-4" d="M69.5,7,67,7.6l.7-2.4a2,2,0,0,0-1.4-2.5A1.84,1.84,0,0,0,63.9,4l-.7,2.4L61.4,4.6a2,2,0,0,0-2.8-.1,2,2,0,0,0-.1,2.8l1.8,1.8-2.5.6a2,2,0,0,0-1.5,2.4,2,2,0,0,0,2.4,1.5l2.5-.6-.7,2.4a2,2,0,0,0,3.9,1.1l.7-2.4,1.8,1.8a2,2,0,1,0,2.9-2.7L68,11.5l2.5-.6A2,2,0,0,0,72,8.5,2.06,2.06,0,0,0,69.5,7Z" transform="translate(-2.7 -2.61)"/>
        <g id="squiggle" mask="url(#squiggle-mask)">
          <path className="cls-1" d="M56.3,92.3a2.09,2.09,0,0,0,2.1-2c0-1.6,1.6-2.5,4.1-3.8a18.17,18.17,0,0,0,4.1-2.7,6.44,6.44,0,0,0,2.1-4.6c.1-4-3.2-6-5.8-7.6-2.4-1.5-3.9-2.4-3.9-4s1.6-2.5,4.1-3.8c2.7-1.5,6.1-3.3,6.2-7.3s-3.2-6-5.8-7.6c-2.4-1.5-3.9-2.4-3.9-4s1.6-2.5,4.1-3.8c2.7-1.5,6.1-3.3,6.2-7.3a2.05,2.05,0,0,0-4.1-.1c0,1.6-1.6,2.5-4.1,3.8-2.7,1.5-6.1,3.3-6.2,7.3s3.2,6,5.8,7.6c2.4,1.5,3.9,2.4,3.9,4s-1.6,2.5-4.1,3.8c-2.7,1.5-6.1,3.3-6.2,7.3s3.2,6,5.8,7.6c2.4,1.5,3.9,2.4,3.9,4s-1.6,2.5-4.1,3.8c-2.7,1.5-6.1,3.3-6.2,7.3A2,2,0,0,0,56.3,92.3Z" transform="translate(-2.7 -2.61)"/>
        </g>
        <g id="right-line" mask="url(#right-line-mask)">
          <path className="cls-1" d="M94.7,64.5a2,2,0,0,0-2.8-.4c-15.9,11.6-17,27.4-17,28a2,2,0,0,0,1.9,2.1,2.46,2.46,0,0,0,1.5-.5,1.61,1.61,0,0,0,.6-1.3c0-.1,1-14.6,15.4-25A2.07,2.07,0,0,0,94.7,64.5Z" transform="translate(-2.7 -2.61)"/>
        </g>
        <g id="left-line" mask="url(#left-line-mask)">
          <path className="cls-1" d="M35.8,73.3l.2-.2a2,2,0,0,0,.2-2.6A43.54,43.54,0,0,0,29.4,63a1.94,1.94,0,0,0-2.8.2,2,2,0,0,0,.2,2.8A44.29,44.29,0,0,1,33,72.8,2,2,0,0,0,35.8,73.3Z" transform="translate(-2.7 -2.61)"/>
          <path className="cls-4" d="M41.8,94.4a2.05,2.05,0,0,0,2-2,35.88,35.88,0,0,0-3.3-14.5,2,2,0,0,0-3.6,1.6,32.83,32.83,0,0,1,3,12.7A1.93,1.93,0,0,0,41.8,94.4Z" transform="translate(-2.7 -2.61)"/>
        </g>

        <circle id="blue-dot-3" className="cls-1 dot left-side" cx="2" cy="89.29" r="2"/>
        <circle id="red-dot-4" className="cls-3 dot left-side" cx="24.6" cy="89.79" r="2"/>
        <circle id="blue-dot-4" className="cls-1 dot" cx="121" cy="86.49" r="2"/>
        <circle id="blue-dot-5" className="cls-1 dot left-side" cx="42.3" cy="61.89" r="2"/>
        <circle id="yellow-dot" className="cls-2 dot left-side" cx="31.1" cy="55.99" r="2"/>
        <circle id="red-dot-1" className="cls-3 dot" cx="63" cy="25.59" r="2"/>
        <circle id="mint-dot-1" className="cls-4 dot left-side" cx="43.2" cy="22.29" r="2"/>
        <circle id="mint-dot-2" className="cls-4 dot" cx="96.3" cy="54.69" r="2"/>
        <circle id="blue-dot-1" className="cls-1 dot" cx="84.3" cy="82.79" r="2"/>
        <circle id="red-dot-2" className="cls-3 dot left-side" cx="17" cy="52.79" r="2"/>
        <circle id="red-dot-3" className="cls-3 dot" cx="70.3" cy="73.89" r="2"/>
        <circle id="blue-dot-2" className="cls-1 dot" cx="79.3" cy="54.29" r="2"/>

        </svg>

        <meta name="author" content="https://codepen.io/ericdjohnson/pen/zYxmKWo" />
        <style>
        {`
          .spinner {
            margin: 100px auto;
            width: 40px;
            height: 40px;
            position: relative;
            text-align: center;

            -webkit-animation: sk-rotate 2.0s infinite linear;
            animation: sk-rotate 2.0s infinite linear;
          }

          .dot1, .dot2 {
            width: 60%;
            height: 60%;
            display: inline-block;
            position: absolute;
            top: 0;
            background-color: #333;
            border-radius: 100%;

            -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
            animation: sk-bounce 2.0s infinite ease-in-out;
          }

          .dot2 {
            top: auto;
            bottom: 0;
            -webkit-animation-delay: -1.0s;
            animation-delay: -1.0s;
          }

          @-webkit-keyframes sk-rotate { 100% { -webkit-transform: rotate(360deg) }}
          @keyframes sk-rotate { 100% { transform: rotate(360deg); -webkit-transform: rotate(360deg) }}

          @-webkit-keyframes sk-bounce {
            0%, 100% { -webkit-transform: scale(0.0) }
            50% { -webkit-transform: scale(1.0) }
          }

          @keyframes sk-bounce {
            0%, 100% {
              transform: scale(0.0);
              -webkit-transform: scale(0.0);
            } 50% {
              transform: scale(1.0);
              -webkit-transform: scale(1.0);
            }
          }
          #GoodbyePage{

          display: flex;
          align-items: center;
          height: 100vh;
          justify-content: center;
          }
          #Layer_1{
            width: 600px;

          }
          .cls-1 {
            fill: #2c51a3;
          }

          .cls-2 {
            fill: #faaf4c;
          }
          .cls-3 {
            fill: #f16279;
          }

          .cls-4 {
            fill: #78c8aa;
          }

          .cls-5 {
            fill: none;
            stroke-width: 6px;
          }

          .cls-5, .cls-6 {
            stroke: #000;
            stroke-linecap: round;
            stroke-miterlimit: 10;
          }

          .mask {
            fill: black;
            stroke: white;
            stroke-width: 5px;
          }

          #squiggle-mask-path {
            stroke-dasharray: 80;
            stroke-dashoffset: 80;
            animation: animate-stroke 1s 1.1s forwards cubic-bezier(0,1,.53,1);
          }

          #left-line-mask-path {
            stroke-dasharray: 38;
            stroke-dashoffset: -38;
            animation: animate-stroke 1s 1.2s forwards cubic-bezier(0,1,.53,1);
          }

          #right-line-mask-path {
            stroke-dasharray: 38;
            stroke-dashoffset: -38;
            animation: animate-stroke 1s 1.2s forwards cubic-bezier(0,1,.53,1);
          }

          @keyframes animate-stroke {
            100% {
              stroke-dashoffset: 0;
            }
          }


          #mint-burst {
            transform: translateY(70px);
            animation: move-stars 1s 1s forwards cubic-bezier(0,1,.53,1);
          }

          #yellow-burst {
            transform: translate(40px, 10px);
            animation: move-stars 1s 1s forwards cubic-bezier(0,1,.53,1);
          }

          #red-burst {
            transform: translate(-40px, 10px);
            animation: move-stars 1s 1s forwards cubic-bezier(0,1,.53,1);
          }

          #blue-star {
            transform: translate(10px, 40px);
            animation: move-stars 1s 1025ms forwards cubic-bezier(0,1,.53,1);
            display: inherit;
          }

          #yellow-star {
            transform: translate(-10px, 45px);
            animation: move-stars 1s 1050ms forwards cubic-bezier(0,1,.53,1);
          }

          @keyframes move-stars {
            100% {
              transform: translateY(0);
            }
          }

          .dot {
            animation: reveal-dots 0.9s 1.2s both cubic-bezier(0,1,.53,1);
            opacity: 0;
            transform: translate(-5px, 10px);

          }

          .dot.left-side {
            transform: translate(5px, 10px);
          }

          @keyframes reveal-dots {
            100% {
              opacity: 1;
              transform: translate(0, 0);
            }
          }
          `}
        </style>
    </div>
  )
}


export default ExitPage;
