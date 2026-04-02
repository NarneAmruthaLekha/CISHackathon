def generate_report(findings):
    # Base score is 10.0
    score = 10.0
    for f in findings:
        if f["risk"] == "HIGH":
            score -= 3.0
        elif f["risk"] == "MEDIUM":
            score -= 1.5
        elif f["risk"] == "LOW":
            score -= 0.5
            
    score = max(1.0, round(score, 1))
    
    overall_risk = "LOW"
    
    has_high = any(f["risk"] == "HIGH" for f in findings)
    med_count = sum(1 for f in findings if f["risk"] == "MEDIUM")
    
    if has_high:
        overall_risk = "HIGH"
    elif med_count >= 2:
        overall_risk = "MEDIUM"
    elif not findings:
        overall_risk = "SECURE"
        score = 10.0

    return {
        "findings": findings,
        "overall_risk": overall_risk,
        "score": score
    }
