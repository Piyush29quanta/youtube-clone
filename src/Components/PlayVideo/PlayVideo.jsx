import React, { useState, useEffect } from "react";
import "./PlayVideo.css";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import { API_KEY, value_converter } from "../../../src/data.jsx";
import moment from "moment/moment.js";

const PlayVideo = ({ videoId }) => {
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  useEffect(() => {
    const fetchVideoData = async () => {
      const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;
      const response = await fetch(videoDetails_url);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setApiData(data.items[0]);
      }
    };
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    const fetchChannelData = async () => {
      if (!apiData) return;
      const channelDetails_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
      const response = await fetch(channelDetails_url);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setChannelData(data.items[0]);
      }
      //comment data
      const commentDetails_url = ` https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}`
      await fetch(commentDetails_url).then(res => res.json()).then(data => setCommentData(data.items))

    };
    fetchChannelData();
  }, [apiData]);

  return (
    <div className="play-video">
      <div className="video-wrapper">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
      <div className="play-video-info">
        <p>
          {apiData ? value_converter(apiData.statistics.viewCount) : "16K"} Views &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : "8 Days ago"}
        </p>
        <div>
          <span>
            <img src={like} alt="like" />
            {apiData?.statistics?.likeCount ? value_converter(apiData.statistics.likeCount) : "10"}
          </span>
          <span>
            <img src={dislike} alt="dislike" />
          </span>
          <span>
            <img src={share} alt="share" />
            Share
          </span>
          <span>
            <img src={save} alt="save" />
            Save
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img src={channelData ? channelData.snippet.thumbnails.default.url : ""} alt="publisher" />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
          <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : ""} Subscribers</span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>{apiData ? apiData.snippet.description.slice(0, 250) : "Description Here"}</p>
        <hr />
        <h4>{apiData ? value_converter(apiData.statistics.commentCount) : "0 Comments"} Comments</h4>
        {commentData.map((item, index) => {
          return (
            <div key={index} className="comment">
              <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="user" />
              <div>
                <h3>
                  {item.snippet.topLevelComment.snippet.authorDisplayName}  <span>1 day ago</span>
                </h3>
                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                <div className="comment-action">
                  <img src={like} alt="like" />
                  <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                  <img src={dislike} alt="dislike" />
                  <span>1</span>
                </div>
              </div>
            </div>
          )

        })}

      </div>
    </div>
  );
};

export default PlayVideo;
