# helpers/plain_language_utils.py
def generate_plain_language_summary(stats_dict):
    """
    Converts a Pandas describe() output (as a dictionary) into a plain language summary.
    
    Args:
        stats_dict (dict): Dictionary from df.describe().to_dict() for numeric columns.
        
    Returns:
        str: A plain language summary of statistics.
    """
    summary_lines = []
    
    for column, stats in stats_dict.items():
        # Build a summary string for each numeric column
        count = stats.get('count', 'N/A')
        mean = stats.get('mean', 'N/A')
        std = stats.get('std', 'N/A')
        min_val = stats.get('min', 'N/A')
        q25 = stats.get('25%', 'N/A')
        median = stats.get('50%', 'N/A')
        q75 = stats.get('75%', 'N/A')
        max_val = stats.get('max', 'N/A')
        
        summary = (
            f"Column '{column}' has {count} values. The average is {mean:.2f} with a standard deviation of {std:.2f}. "
            f"It ranges from {min_val:.2f} (minimum) up to {max_val:.2f} (maximum). "
            f"Values at the 25th, 50th, and 75th percentiles are {q25:.2f}, {median:.2f}, and {q75:.2f} respectively."
        )
        summary_lines.append(summary)
    
    # Join all summaries into one plain language report
    return "\n\n".join(summary_lines)
