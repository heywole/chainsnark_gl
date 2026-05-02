# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import json

class ChainSnarkOracle(gl.Contract):
    """
    ChainSnark - The Blockchain That Judges You
    Feature: THE ORACLE
    Answers any yes/no question with brutal AI reasoning. All on-chain.
    """

    answers:      dict  # question_id -> answer
    answer_count: int

    def __init__(self):
        self.answers      = {}
        self.answer_count = 0

    # ── Read ──────────────────────────────────────────────────────

    @gl.public.view
    def get_answer(self, answer_id: str) -> str:
        return self.answers.get(answer_id, "")

    @gl.public.view
    def get_total_answers(self) -> int:
        return self.answer_count

    @gl.public.view
    def get_recent_answers(self) -> str:
        keys = list(self.answers.keys())[-10:]
        return json.dumps(keys)

    # ── Write ─────────────────────────────────────────────────────

    @gl.public.write
    def ask_oracle(self, question: str) -> None:
        """
        Ask the on-chain AI oracle any yes/no question.
        Returns a verdict with brutal honest reasoning.
        """

        prompt = f"""You are ChainSnark Oracle — a hyper-intelligent, brutally honest AI that lives permanently on the blockchain.
You have been asked a question. You must answer it directly and honestly.

Rules:
- Start your response with YES or NO on the first line (in caps)
- Then give 2-3 sentences of sharp, specific, no-nonsense reasoning
- End with one punchy memorable verdict line
- No hedging. No "it depends". The chain does not lie.
- Be direct, intelligent, and memorable

Question: {question}

Return ONLY your answer in this format:
YES/NO

[Your reasoning here]

[Final verdict line]"""

        def leader_fn():
            return gl.nondet.exec_prompt(prompt)

        def validator_fn(leaders_res) -> bool:
            if not isinstance(leaders_res, gl.vm.Return):
                return False
            answer_text = str(leaders_res.calldata).strip()
            # Must start with YES or NO
            return answer_text.startswith("YES") or answer_text.startswith("NO")

        answer_text = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)

        answer_id = f"q_{self.answer_count}"
        self.answers[answer_id] = json.dumps({
            "question":  question,
            "answer":    str(answer_text),
            "answer_id": answer_id,
        })
        self.answer_count += 1
