"""Roadmap module registry and planned phase placeholders."""

from typing import Dict, List
from fastapi import APIRouter
from app.core.errors import EntityNotFoundException, PhaseNotImplementedException
from app.schemas.common import PlannedModuleInfo, ResponseEnvelope

router = APIRouter()

ROADMAP_MODULES: Dict[str, PlannedModuleInfo] = {
    "playground": PlannedModuleInfo(
        module_name="Playground",
        phase_number=2,
        phase_title="Model Playground & Integration",
        description="Interactive multi-model comparison sandbox with latency, token usage, and side-by-side prompt tuning.",
        target_capabilities=[
            "Direct model streaming with token telemetry",
            "Multi-provider adapter architecture (OpenAI, Anthropic, Gemini, Local)",
            "System prompt and parameter variation testing",
            "Turn-by-turn conversation recording",
        ],
    ),
    "experiments": PlannedModuleInfo(
        module_name="Experiments",
        phase_number=2,
        phase_title="Model Playground & Integration",
        description="Structured experiment tracking environment for prompt versions, parameter sweeps, and model checkpoints.",
        target_capabilities=[
            "Experiment lineage and artifact logging",
            "Run comparison and differential output views",
            "Metadata tagging and hypothesis tracking",
        ],
    ),
    "benchmarks": PlannedModuleInfo(
        module_name="Benchmarks",
        phase_number=3,
        phase_title="Benchmark & Dataset Engine",
        description="Standardized research benchmark suite execution (e.g. MMLU, GSM8K, HumanEval, ARC).",
        target_capabilities=[
            "Standard and custom benchmark suites",
            "Batch execution harness with concurrency control",
            "Reproducible test scoring matrices",
        ],
    ),
    "datasets": PlannedModuleInfo(
        module_name="Datasets",
        phase_number=3,
        phase_title="Benchmark & Dataset Engine",
        description="Evaluation dataset management, schema validation, versioning, and curated test case repositories.",
        target_capabilities=[
            "JSONL/CSV dataset ingestion and validation",
            "Few-shot prompt example curation",
            "Ground-truth label management",
        ],
    ),
    "evaluators": PlannedModuleInfo(
        module_name="Evaluators",
        phase_number=4,
        phase_title="Evaluation & Scoring Engine",
        description="Automated scoring engines, rule-based validators, semantic similarity evaluators, and LLM-as-a-Judge pipelines.",
        target_capabilities=[
            "Exact match, regex, and schema compliance checking",
            "Embedding-based semantic similarity scoring",
            "Calibrated LLM-as-a-Judge rubrics",
        ],
    ),
    "failure-analysis": PlannedModuleInfo(
        module_name="Failure Analysis",
        phase_number=6,
        phase_title="Failure Analysis & Error Intelligence",
        description="Deep error taxonomy, automated failure clustering, refusal diagnosis, and edge-case intelligence.",
        target_capabilities=[
            "Error categorization (reasoning lapse, hallucination, refusal, format violation)",
            "Automated failure clustering via embedding analysis",
            "Root-cause pattern detection across model families",
        ],
    ),
    "model-comparison": PlannedModuleInfo(
        module_name="Model Comparison",
        phase_number=8,
        phase_title="Model Intelligence & Comparative Analytics",
        description="Comprehensive head-to-head model intelligence, Pareto frontiers (cost vs quality vs speed), and win-rate matrices.",
        target_capabilities=[
            "Elo rating and Bradley-Terry win-rate calculations",
            "Cost/token vs accuracy Pareto frontiers",
            "Radar comparisons across intelligence dimensions",
        ],
    ),
    "reliability": PlannedModuleInfo(
        module_name="Reliability",
        phase_number=9,
        phase_title="Confidence, Calibration & Reliability",
        description="Logprob calibration curves, uncertainty estimation, drift detection, and consistency stress-testing.",
        target_capabilities=[
            "Expected Calibration Error (ECE) analysis",
            "Temperature variance sensitivity tests",
            "Temporal stability and degradation tracking",
        ],
    ),
}


@router.get(
    "",
    response_model=ResponseEnvelope[List[PlannedModuleInfo]],
    summary="List all roadmap modules and their planned implementation phases",
)
async def list_roadmap_modules() -> ResponseEnvelope[List[PlannedModuleInfo]]:
    return ResponseEnvelope(data=list(ROADMAP_MODULES.values()))


@router.get(
    "/{module_slug}",
    response_model=ResponseEnvelope[PlannedModuleInfo],
    summary="Get roadmap specifications for a specific future module",
)
async def get_roadmap_module(module_slug: str) -> ResponseEnvelope[PlannedModuleInfo]:
    key = module_slug.lower().strip()
    if key not in ROADMAP_MODULES:
        raise EntityNotFoundException("Roadmap Module", module_slug)
    return ResponseEnvelope(data=ROADMAP_MODULES[key])


@router.post(
    "/{module_slug}/execute",
    summary="Action attempt on an unreleased module (strictly rejected in Phase 1)",
)
async def reject_unreleased_action(module_slug: str):
    key = module_slug.lower().strip()
    info = ROADMAP_MODULES.get(key)
    if not info:
        raise EntityNotFoundException("Roadmap Module", module_slug)
    raise PhaseNotImplementedException(
        feature_name=info.module_name,
        planned_phase=info.phase_number,
        phase_title=info.phase_title,
    )
