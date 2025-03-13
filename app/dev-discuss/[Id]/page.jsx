"use client";



export default function QuestionDetailPage({ params }) {
  
  const { Id } = params;

  const [questionData, setQuestionData] = useState(null);
  const [votes, setVotes] = useState(0);
  const [userVote, setUserVote] = useState(0);
  const [replyContent, setReplyContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchQuestion = async () => {
      const question = await getQuestionById(Id);
      question.replies = question.replies || [];
      setQuestionData(question);
      setVotes(question.votes);
    };

    fetchQuestion();
  }, [Id]);

  const handleUpvote = async () => {
    if (userVote === 1) return;

    try {
      const response = await fetch(`/api/questions/${Id}/upvote`, {
        method: "POST",
      });
      if (response.ok) {
        setVotes((prev) => prev + 1);
        setUserVote(1);
      } else {
        toast.error("Failed to upvote");
      }
    } catch (error) {
      console.error("Error upvoting:", error);
      toast.error("Error upvoting. Please try again.");
    }
  };

  const handleDownvote = async () => {
    if (userVote === -1) return;

    try {
      const response = await fetch(`/api/questions/${Id}/downvote`, {
        method: "POST",
      });
      if (response.ok) {
        setVotes((prev) => prev - 1);
        setUserVote(-1);
      } else {
        toast.error("Failed to downvote");
      }
    } catch (error) {
      console.error("Error downvoting:", error);
      toast.error("Error downvoting. Please try again.");
    }
  };
  
  const handlePostReply = async () => {
    if (!replyContent.trim()) return;
    setIsPosting(true);

    try {
      const response = await fetch(`/api/questions/${Id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: replyContent }),
      });

      if (response.ok) {
        const { reply, answers } = await response.json();
        setQuestionData((prevData) => ({
          ...prevData,
          replies: [...prevData.replies, reply],
          answers,
        }));
        setReplyContent("");
      } else {
        toast.error("Failed to post reply");
      }
    } catch (error) {
      console.error("Error posting reply:", error);
    } finally {
      setIsPosting(false);
    }
  };

  if (!questionData) {
    return <QuestionDetailLoading />;
  }



  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        
         <h1>Dev dicuss question page id</h1>
        
         

        

        
       
       
        
      </div>
    </main>
  );
}
