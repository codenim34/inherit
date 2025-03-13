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
        <header className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold mb-2">{questionData.title}</h1>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div>
              <span className="text-blue-600">by {questionData.author}</span> |{" "}
              <span>{new Date(questionData.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex gap-2">
              {questionData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        <div className="flex gap-6 items-start mb-8">
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleUpvote}
              disabled={userVote === 1}
            >
              <ArrowUp
                className={`h-6 w-6 ${userVote === 1 ? "text-blue-600" : ""}`}
              />
            </Button>
            <span className="text-xl font-semibold">{votes}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownvote}
              disabled={userVote === -1}
            >
              <ArrowDown
                className={`h-6 w-6 ${userVote === -1 ? "text-red-600" : ""}`}
              />
            </Button>
          </div>
          <div className="flex-1">
            {/* Render question description as markdown */}
            <ReactMarkdown remarkPlugins={[remarkGfm]} className="text-lg mb-6">
              {questionData.description}
            </ReactMarkdown>
            <p className="text-muted-foreground">
              <span className="font-semibold">{questionData.answers}</span>{" "}
              answers
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
