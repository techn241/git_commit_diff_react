
import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './codeReviewPage.css';
import axios from 'axios';

const CodeReviewPage = () => {
  const [apiData, setApiData] = useState([]);
  const [commitInfo, setCommitInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the dynamic part from the frontend URL
        const dynamicPart = window.location.pathname;
  
        // Construct the API endpoint using the dynamic part
        const apiEndpoint = `http://localhost:3000${dynamicPart}`;
  
        // Make the API request
        const response = await axios.get(apiEndpoint, {
          headers: { 'Content-Type': 'application/json' },
        });
  
        setApiData(response.data.files);
        
        const commitTime = new Date(response.data.commit_time);
        const timeAgo = formatDistanceToNow(commitTime, { addSuffix: true });
        
        setCommitInfo({
          owner: response.data.owner,
          author: response.data.author,
          message: response.data.message,
          time: timeAgo,
          parentCommit: response.data.parent_commit_sha,
          commit_sha: response.data.commit_sha,
          parentCommitDate: response.data.date,
        });

        console.log(response.data);
      } catch (error) {
        console.log('error', error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div className='mainDiv'>
      {/* Display commit information - Left Section */}
      <div className='upper-left-section'>
        <h2>{commitInfo.message}</h2>
        <p>Authored By <b>{commitInfo.owner}</b> {commitInfo.time}</p>
        <p></p>
      </div>

      {/* Display commit information - Right Section */}
      <div className='upper-right-section'>
        <p>Commited By <b>{commitInfo.author}</b> {commitInfo.time}</p>
        <p>Commit <b>{commitInfo.commit_sha}</b></p>
        <p>Parent <u>{commitInfo.parentCommit}</u></p>
      </div>

      {/* Display file changes */}
      <div className='file-changes'>
        {apiData && apiData.map((item, index) => (
          <Accordion key={index} className='accordian'>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index + 1}-content`}
              id={`panel${index + 1}-header`}
              className="custom-accordion-summary"
            >
              <Typography className="typography-text">{item[0]}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className='collapse-content'>
                {item[1].map((line, lineIndex) => (
                  <div key={lineIndex} className='code-content'>
                    <span className="line-number">{lineIndex + 1}</span>
                    {line.remove && '-'}{line.add && '+'} {line}
                  </div>
                ))}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default CodeReviewPage;
