import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Factory from 'utils/Factory';
import Drafting from './components/Drafting';
import { useParams } from 'react-router-dom';

const Index = () => {
  const { tab, contextId } = useParams();
  const user = useSelector((state) => state.accountReducer.user);
  const [exists, setExists] = useState(null);
  const [draftId, setDraftId] = useState(null);
  const myEventsRef = useRef(null);

  useEffect(() => {
    if (user?.active_context?.id && !draftId) {
      const fetchDraftExists = async () => {
        const response = await Factory('get', `/documentdrafting/document-drafts-exists/${user.active_context.id}/`, {}, {});
        if (response.res?.status === 200) {
          setExists(true);
          // Extract id from response
          const id = response.res?.data?.id;
          setDraftId(id);
        } else if (response.res?.status === 404) {
          setExists(false);
          // If GET returns 404, call POST
          const postRes = await Factory('post', '/documentdrafting/document-drafts-create', { context: user.active_context.id }, {});
          // Extract id from POST response if available
          const id = postRes.res?.data?.id;
          setDraftId(id);
        } else {
          setExists(null); // handle other statuses if needed
          setDraftId(null);
        }
      };
      fetchDraftExists();
    }
  }, [user?.active_context?.id, draftId]);

  const handleShowMyEvents = () => {
    if (myEventsRef.current) {
      myEventsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Conditional rendering based on tab/contextId
  if (!tab && !contextId) {
    // Dashboard view
    return <Drafting id={draftId} />;
  }
  if (tab === 'document' && contextId) {
    // Document selection tab only
    return <Drafting id={draftId} tab="document" contextId={contextId} />;  }
  if (tab === 'event' && contextId) {
    // Event creation tab only
    return <Drafting id={draftId} tab="event" contextId={contextId} />;
  }
  // Fallback: dashboard
  return <Drafting id={draftId} />;
};

export default Index;
