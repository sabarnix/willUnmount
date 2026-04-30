import base64
import json
from googleapiclient import discovery

def stop_vm(event, context):
    project = "nimble-ally-494207-c3"
    zone = "us-central1-a"
    instance = "openclaw-agent"
    
    # Decrypt and parse budget data (optional, but good for logging)
    pubsub_data = base64.b64decode(event['data']).decode('utf-8')
    budget_data = json.loads(pubsub_data)
    
    # We stop the VM if the threshold has been reached
    print(f"Budget threshold reached: {budget_data['costAmount']} / {budget_data['budgetAmount']}")
    
    compute = discovery.build('compute', 'v1')
    request = compute.instances().stop(project=project, zone=zone, instance=instance)
    response = request.execute()
    
    print(f"Stop command sent to VM: {instance}")
