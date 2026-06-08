import json
from typing import Optional
from supabase import Client

def get_database_tools(supabase_client: Client, user_id: str):
    """Factory function to generate database tools tied to a specific user and supabase client."""
    
    def add_todo(task_name: str, importance: str, urgency: str, description: str = "", due_date: str = "", is_completed: bool = False) -> str:
        """Adds a new to-do item for the user.
        
        Args:
            task_name: Task title. NEVER leave blank.
            importance: How valuable is this task? Enum: ['IMPORTANT', 'NOT IMPORTANT']
            urgency: How time-sensitive is this task? Enum: ['URGENT', 'NOT URGENT']
            description: Optional task description.
            due_date: Due date in ISO format.
            is_completed: Whether the task is completed.
        """
        if not supabase_client: return "Supabase client not initialized."
        data = {
            "user_id": user_id,
            "task_name": task_name,
            "importance": importance,
            "urgency": urgency,
            "description": description,
            "is_completed": is_completed
        }
        if due_date: data["due_date"] = due_date
        try:
            response = supabase_client.table("todos").insert(data).execute()
            return f"Successfully added todo: '{task_name}'."
        except Exception as e:
            return f"Error adding todo: {str(e)}"

    def delete_todo(task_id: str) -> str:
        """Deletes a to-do item by its UUID."""
        if not supabase_client: return "Supabase client not initialized."
        try:
            supabase_client.table("todos").delete().eq("id", task_id).execute()
            return f"Successfully deleted todo: {task_id}."
        except Exception as e:
            return f"Error deleting todo: {str(e)}"

    def modify_todo(task_id: str, task_name: Optional[str] = None, importance: Optional[str] = None, urgency: Optional[str] = None, description: Optional[str] = None, due_date: Optional[str] = None, is_completed: Optional[bool] = None) -> str:
        """Modifies a to-do item by its UUID. Only provide fields that need to be updated."""
        if not supabase_client: return "Supabase client not initialized."
        data = {}
        if task_name is not None: data["task_name"] = task_name
        if importance is not None: data["importance"] = importance
        if urgency is not None: data["urgency"] = urgency
        if description is not None: data["description"] = description
        if due_date is not None: data["due_date"] = due_date
        if is_completed is not None: data["is_completed"] = is_completed
        if not data: return "No modifications provided."
        try:
            supabase_client.table("todos").update(data).eq("id", task_id).execute()
            return f"Successfully modified todo: {task_id}."
        except Exception as e:
            return f"Error modifying todo: {str(e)}"

    def add_goal(title: str, description: str = "", target_date: str = "", is_completed: int = 0, is_important: bool = False, is_urgent: bool = False) -> str:
        """Adds a new goal for the user."""
        if not supabase_client: return "Supabase client not initialized."
        data = {
            "user_id": user_id,
            "title": title,
            "description": description,
            "is_completed": is_completed,
            "importance": "IMPORTANT" if is_important else "NOT IMPORTANT",
            "urgency": "URGENT" if is_urgent else "NOT URGENT"
        }
        if target_date: data["target_date"] = target_date
        try:
            response = supabase_client.table("goals").insert(data).execute()
            return f"Successfully added goal: '{title}'."
        except Exception as e:
            return f"Error adding goal: {str(e)}"

    def delete_goal(goal_id: str) -> str:
        """Deletes a goal by its UUID."""
        if not supabase_client: return "Supabase client not initialized."
        try:
            supabase_client.table("goals").delete().eq("id", goal_id).execute()
            return f"Successfully deleted goal: {goal_id}."
        except Exception as e:
            return f"Error deleting goal: {str(e)}"

    def modify_goal(goal_id: str, new_title: Optional[str] = None, new_description: Optional[str] = None, new_target_date: Optional[str] = None, new_is_completed: Optional[int] = None, new_is_important: Optional[bool] = None, new_is_urgent: Optional[bool] = None) -> str:
        """Modifies a goal by its UUID."""
        if not supabase_client: return "Supabase client not initialized."
        data = {}
        if new_title is not None: data["title"] = new_title
        if new_description is not None: data["description"] = new_description
        if new_target_date is not None: data["target_date"] = new_target_date
        if new_is_completed is not None: data["is_completed"] = new_is_completed
        if new_is_important is not None: data["importance"] = "IMPORTANT" if new_is_important else "NOT IMPORTANT"
        if new_is_urgent is not None: data["urgency"] = "URGENT" if new_is_urgent else "NOT URGENT"
        if not data: return "No modifications provided."
        try:
            supabase_client.table("goals").update(data).eq("id", goal_id).execute()
            return f"Successfully modified goal: {goal_id}."
        except Exception as e:
            return f"Error modifying goal: {str(e)}"

    def add_timer_prompt(prompt: str, scheduled_time: str, recurring_type: str = "never", weekdays: Optional[list] = None, response: str = "", sent: bool = False) -> str:
        """Adds a new timer prompt for the user."""
        if not supabase_client: return "Supabase client not initialized."
        data = {
            "user_id": user_id,
            "prompt": prompt,
            "scheduled_time": scheduled_time,
            "recurring_type": recurring_type,
            "weekdays": weekdays if weekdays is not None else [],
            "response": response,
            "sent": sent
        }
        try:
            supabase_client.table("timer_prompts").insert(data).execute()
            return f"Successfully added timer prompt: '{prompt}'."
        except Exception as e:
            return f"Error adding timer prompt: {str(e)}"

    def delete_timer_prompt(prompt_id: str) -> str:
        """Deletes a timer prompt by its UUID."""
        if not supabase_client: return "Supabase client not initialized."
        try:
            supabase_client.table("timer_prompts").delete().eq("id", prompt_id).execute()
            return f"Successfully deleted timer prompt: {prompt_id}."
        except Exception as e:
            return f"Error deleting timer prompt: {str(e)}"

    def modify_timer_prompt(prompt_id: str, new_prompt: Optional[str] = None, new_scheduled_time: Optional[str] = None, new_recurring_type: Optional[str] = None, new_weekdays: Optional[list] = None, new_response: Optional[str] = None, new_sent: Optional[bool] = None) -> str:
        """Modifies a timer prompt by its UUID."""
        if not supabase_client: return "Supabase client not initialized."
        data = {}
        if new_prompt is not None: data["prompt"] = new_prompt
        if new_scheduled_time is not None: data["scheduled_time"] = new_scheduled_time
        if new_recurring_type is not None: data["recurring_type"] = new_recurring_type
        if new_weekdays is not None: data["weekdays"] = new_weekdays
        if new_response is not None: data["response"] = new_response
        if new_sent is not None: data["sent"] = new_sent
        if not data: return "No modifications provided."
        try:
            supabase_client.table("timer_prompts").update(data).eq("id", prompt_id).execute()
            return f"Successfully modified timer prompt: {prompt_id}."
        except Exception as e:
            return f"Error modifying timer prompt: {str(e)}"

    def add_feedback(feedback: str) -> str:
        """Adds new user feedback."""
        if not supabase_client: return "Supabase client not initialized."
        data = {
            "user_id": user_id,
            "feedback": feedback
        }
        try:
            supabase_client.table("user_feedback").insert(data).execute()
            return "Successfully added feedback."
        except Exception as e:
            return f"Error adding feedback: {str(e)}"

    def delete_feedback(feedback_id: str) -> str:
        """Deletes user feedback by its UUID."""
        if not supabase_client: return "Supabase client not initialized."
        try:
            supabase_client.table("user_feedback").delete().eq("id", feedback_id).execute()
            return f"Successfully deleted feedback: {feedback_id}."
        except Exception as e:
            return f"Error deleting feedback: {str(e)}"

    def modify_feedback(feedback_id: str, new_feedback: str) -> str:
        """Modifies user feedback by its UUID."""
        if not supabase_client: return "Supabase client not initialized."
        data = {"feedback": new_feedback}
        try:
            supabase_client.table("user_feedback").update(data).eq("id", feedback_id).execute()
            return f"Successfully modified feedback: {feedback_id}."
        except Exception as e:
            return f"Error modifying feedback: {str(e)}"

    def add_system_tool(goal_id: str, title: str, description: str = "", order_index: int = 0) -> str:
        """Adds a new system tool to a goal."""
        if not supabase_client: return "Supabase client not initialized."
        data = {
            "user_id": user_id,
            "goal_id": goal_id,
            "system_name": title,
            "is_completed": False,
            "priority_order": order_index
        }
        try:
            supabase_client.table("systems").insert(data).execute()
            return f"Successfully added system tool: '{title}'."
        except Exception as e:
            return f"Error adding system tool: {str(e)}"

    def delete_system_tool(step_id: str) -> str:
        """Deletes a system tool by its UUID."""
        if not supabase_client: return "Supabase client not initialized."
        try:
            supabase_client.table("systems").delete().eq("id", step_id).execute()
            return f"Successfully deleted system tool: {step_id}."
        except Exception as e:
            return f"Error deleting system tool: {str(e)}"

    def modify_system_tool(step_id: str, new_title: Optional[str] = None, new_description: Optional[str] = None, new_is_completed: Optional[bool] = None, new_order_index: Optional[int] = None) -> str:
        """Modifies a system tool by its UUID."""
        if not supabase_client: return "Supabase client not initialized."
        data = {}
        if new_title is not None: data["system_name"] = new_title
        if new_is_completed is not None: data["is_completed"] = new_is_completed
        if new_order_index is not None: data["priority_order"] = new_order_index
        # description isn't in DB according to schema, skipping mapping but accepting param just in case
        if not data: return "No modifications provided."
        try:
            supabase_client.table("systems").update(data).eq("id", step_id).execute()
            return f"Successfully modified system tool: {step_id}."
        except Exception as e:
            return f"Error modifying system tool: {str(e)}"

    def add_to_achieve_tool(goal_id: str, title: str, description: str = "", order_index: int = 0) -> str:
        """Adds a new 'To Achieve' tool to a goal."""
        if not supabase_client: return "Supabase client not initialized."
        data = {
            "user_id": user_id,
            "goal_id": goal_id,
            "title": title,
            "is_completed": False,
            "priority_order": order_index
        }
        try:
            supabase_client.table("to_achieves").insert(data).execute()
            return f"Successfully added To Achieve tool: '{title}'."
        except Exception as e:
            return f"Error adding To Achieve tool: {str(e)}"

    def delete_to_achieve_tool(step_id: str) -> str:
        """Deletes a 'To Achieve' tool by its UUID."""
        if not supabase_client: return "Supabase client not initialized."
        try:
            supabase_client.table("to_achieves").delete().eq("id", step_id).execute()
            return f"Successfully deleted To Achieve tool: {step_id}."
        except Exception as e:
            return f"Error deleting To Achieve tool: {str(e)}"

    def modify_to_achieve_tool(step_id: str, new_title: Optional[str] = None, new_description: Optional[str] = None, new_is_completed: Optional[bool] = None, new_order_index: Optional[int] = None) -> str:
        """Modifies a 'To Achieve' tool by its UUID."""
        if not supabase_client: return "Supabase client not initialized."
        data = {}
        if new_title is not None: data["title"] = new_title
        if new_is_completed is not None: data["is_completed"] = new_is_completed
        if new_order_index is not None: data["priority_order"] = new_order_index
        # description isn't in DB according to schema, skipping mapping but accepting param just in case
        if not data: return "No modifications provided."
        try:
            supabase_client.table("to_achieves").update(data).eq("id", step_id).execute()
            return f"Successfully modified To Achieve tool: {step_id}."
        except Exception as e:
            return f"Error modifying To Achieve tool: {str(e)}"

    def add_reminder(title: str, scheduled_date: str, body: str = "", reminder_type: str = "basic", options: Optional[list] = None, expected_answer: str = "", ai_prompt: str = "") -> str:
        """Adds a new reminder."""
        if not supabase_client: return "Supabase client not initialized."
        data = {
            "user_id": user_id,
            "title": title,
            "body": body,
            "scheduled_date": scheduled_date,
            "payload": title,
            "reminder_type": reminder_type,
            "options": json.dumps(options) if options else None,
            "expected_answer": expected_answer,
            "ai_prompt": ai_prompt
        }
        try:
            supabase_client.table("reminders").insert(data).execute()
            return f"Successfully added reminder: '{title}'."
        except Exception as e:
            return f"Error adding reminder: {str(e)}"

    def delete_reminder(reminder_id: str) -> str:
        """Deletes a reminder by its UUID."""
        if not supabase_client: return "Supabase client not initialized."
        try:
            supabase_client.table("reminders").delete().eq("id", reminder_id).execute()
            return f"Successfully deleted reminder: {reminder_id}."
        except Exception as e:
            return f"Error deleting reminder: {str(e)}"

    def modify_reminder(reminder_id: str, new_title: Optional[str] = None, new_body: Optional[str] = None, new_scheduled_date: Optional[str] = None, new_reminder_type: Optional[str] = None, new_options: Optional[list] = None, new_expected_answer: Optional[str] = None, new_ai_prompt: Optional[str] = None) -> str:
        """Modifies a reminder by its UUID."""
        if not supabase_client: return "Supabase client not initialized."
        data = {}
        from datetime import datetime
        if new_title is not None: 
            data["title"] = new_title
            data["payload"] = new_title
        if new_body is not None: data["body"] = new_body
        if new_scheduled_date is not None: data["scheduled_date"] = new_scheduled_date
        if new_reminder_type is not None: data["reminder_type"] = new_reminder_type
        if new_options is not None: data["options"] = json.dumps(new_options)
        if new_expected_answer is not None: data["expected_answer"] = new_expected_answer
        if new_ai_prompt is not None: data["ai_prompt"] = new_ai_prompt
        
        if not data: return "No modifications provided."
        
        data["updated_at"] = datetime.utcnow().isoformat()
        try:
            supabase_client.table("reminders").update(data).eq("id", reminder_id).execute()
            return f"Successfully modified reminder: {reminder_id}."
        except Exception as e:
            return f"Error modifying reminder: {str(e)}"

    def query_user_data(table_name: str) -> str:
        """Fetches all records for a specific table (e.g. 'todos', 'goals') to let you read current data."""
        if not supabase_client: return "Supabase client not initialized."
        try:
            # We explicitly enforce the user_id scope here just in case,
            # but if it's a properly authenticated RLS client, it might not be needed.
            # Doing it explicitly is safer.
            response = supabase_client.table(table_name).select("*").eq("user_id", user_id).execute()
            return f"Records for {table_name}: {json.dumps(response.data)}"
        except Exception as e:
            return f"Error querying {table_name}: {str(e)}"

    return {
        "add_todo": add_todo,
        "delete_todo": delete_todo,
        "modify_todo": modify_todo,
        "add_goal": add_goal,
        "delete_goal": delete_goal,
        "modify_goal": modify_goal,
        "add_timer_prompt": add_timer_prompt,
        "delete_timer_prompt": delete_timer_prompt,
        "modify_timer_prompt": modify_timer_prompt,
        "add_feedback": add_feedback,
        "delete_feedback": delete_feedback,
        "modify_feedback": modify_feedback,
        "add_system_tool": add_system_tool,
        "delete_system_tool": delete_system_tool,
        "modify_system_tool": modify_system_tool,
        "add_to_achieve_tool": add_to_achieve_tool,
        "delete_to_achieve_tool": delete_to_achieve_tool,
        "modify_to_achieve_tool": modify_to_achieve_tool,
        "add_reminder": add_reminder,
        "delete_reminder": delete_reminder,
        "modify_reminder": modify_reminder,
        "query_user_data": query_user_data
    }
